import * as fs from 'fs';
import * as path from 'path';

type tableName = 'users' | 'concerts';
/**
 * This class is just for simulate database instance since the interview requirement is not required to use database
 */
export class Db {
  private static readonly dataPath = path.join(
    process.cwd(),
    'src/servers/db-data.json',
  );

  static readData<T>(tableName: tableName): T {
    const data = fs.readFileSync(this.dataPath, 'utf8');
    const parsedData = JSON.parse(data);
    return parsedData[tableName] as T;
  }

  static writeData<T>(tableName: tableName, data: T): void {
    const fullData = fs.readFileSync(this.dataPath, 'utf8');
    const parsedData = JSON.parse(fullData);
    const updatedData = { ...parsedData, [tableName]: data };
    fs.writeFileSync(this.dataPath, JSON.stringify(updatedData, null, 4));
  }
}
