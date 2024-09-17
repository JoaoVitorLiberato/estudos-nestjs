import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    const books = await this.bookModel.find();
    return books;
  }

  async create(book: Book): Promise<Book> {
    const res = await this.bookModel.create(book);
    return res;
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);
    return book;
  }

  async updateById(id: string, bookUpdated: Book): Promise<Book> {
    const book = await this.bookModel.findByIdAndUpdate(id, bookUpdated, {
      new: true,
      runValidators: true,
    });

    return book;
  }

  async deleteById(id: string): Promise<string> {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
