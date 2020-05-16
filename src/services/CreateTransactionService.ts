import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRopository = getRepository(Category);

    let category = await categoriesRopository.findOne({
      where: {
        title: categoryTitle,
      },
    });

    if (!category) {
      const newCategory = categoriesRopository.create({
        title: categoryTitle,
      });
      await categoriesRopository.save(newCategory);

      category = newCategory;
    }

    const balance = await transactionsRepository.getBalance();

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Transação inválida');
    }

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Saldo insuficiente');
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: category.id,
    });

    await transactionsRepository.save(transaction);

    const transactionReturn = {
      ...transaction,
      category,
    };

    return transactionReturn;
  }
}

export default CreateTransactionService;
