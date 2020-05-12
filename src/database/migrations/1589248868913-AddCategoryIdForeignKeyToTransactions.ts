import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

class AddCategoryIdForeignKeyToTransactions1589248868913
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'TransactionCategory',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('categories', 'TransactionCategory');
  }
}

export default AddCategoryIdForeignKeyToTransactions1589248868913;
