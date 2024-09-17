import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.schema';
import { readonlyBookDto } from './dto/readonly-book.dto';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  async getAllBooks(): Promise<Book[]> {
    try {
      const responseService = await this.bookService.findAll();

      if (!responseService) throw Error('not-data');

      return responseService;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          codigo: 'data-not-fount',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post()
  async createBook(
    @Body()
    book: readonlyBookDto,
  ): Promise<Book> {
    return await this.bookService.create(book);
  }

  @Get(':id')
  async findById(
    @Param('id')
    id: string,
  ): Promise<Book> {
    try {
      const responseService = await this.bookService.findById(id);

      if (!responseService) throw Error('Error');

      return responseService;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          codigo: 'book-not-found',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Put(':id')
  async updateById(
    @Param('id')
    id: string,
    @Body()
    book: readonlyBookDto,
  ) {
    try {
      const responseService = await this.bookService.updateById(id, book);

      if (!responseService) throw Error('error-update');

      return {
        codigo: 'update-book',
        message: 'The book was updated with success.',
        bookUpdated: responseService,
      };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          codigo: 'error-update-book',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  async deleteById(
    @Param('id')
    id: string,
  ) {
    try {
      await this.bookService.deleteById(id);

      return {
        codigo: 'book-removed',
        message: 'The book was deleted with success!',
      };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NO_CONTENT,
          codigo: 'error-for-delete',
        },
        HttpStatus.NO_CONTENT,
      );
    }
  }
}
