import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    private readonly userService: UsersService,
    private readonly wishesService: WishesService,
    @InjectRepository(Offer)
    public offersRepository: Repository<Offer>,
  ) {}

  async create() {

  }

  async findAll() {

  }

  async findOne(id: number) {
    return this.offersRepository.findOneBy({ id });
  }

  async update() {

  }

  async remove(id: number) {
    const deletedOffer = await this.findOne(id);
    await this.offersRepository.delete(id);
    return deletedOffer;
  }
}