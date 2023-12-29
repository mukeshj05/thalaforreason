import { ConfigService } from '@nestjs/config';
import { ModelCtor, Sequelize } from 'sequelize-typescript';
import * as glob from 'glob';
import * as path from 'path';
// import { User } from 'src/app.model';

export class DatabaseModel {
  sequelize: Sequelize;

  constructor(private readonly config: ConfigService) {
    this.sequelize = new Sequelize(this.config.get('db'));
    this.sequelize.addModels(this.getAllModels());
  }

  getAllModels(): ModelCtor[] {
    const projectRoot = process.cwd();
    const modelPattern = '**/model.js';
    const pattern = '**/*.model.js';
    const indexPattern = 'models/index.js';

    const modelFiles = glob.sync(modelPattern, { cwd: projectRoot });
    const files = glob.sync(pattern, { cwd: projectRoot });
    const indexPaths = glob.sync(indexPattern, { cwd: projectRoot });

    return [...modelFiles, ...files, ...indexPaths].flatMap((file) =>
      this.getModelFromPath(file),
    );
  }

  getModelFromPath(file: string): ModelCtor[] {
    if (file.includes('node_modules')) {
      return [];
    } else {
      const projectRoot = process.cwd();
      const filepath = path.resolve(projectRoot, file);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const model = require(filepath);
      return Object.values(model);
    }
  }
}
