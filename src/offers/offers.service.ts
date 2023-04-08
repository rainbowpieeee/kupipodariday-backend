import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(offer: CreateOfferDto, user) {
    const wish = await this.wishesService.findOne(offer.itemId);
    if (!wish) throw new NotFoundException('Такого подарка не существует');
    if (wish.owner.id === user.id)
      throw new BadRequestException('Нельзя скидываться на свои подарки');
    if (Number(wish.raised) == Number(wish.price))
      throw new BadRequestException('Нужная сумма уже набрана');
    if (Number(wish.raised) + Number(offer.amount) > Number(wish.price))
      throw new BadRequestException('Сумма пожертвования слишком велика');

    const raised = Number(wish.raised) + Number(offer.amount);

    await this.wishesService.updateRaised(wish.id, +raised);
    return await this.offerRepository.save({
      ...offer,
      user: user,
      item: wish,
    });
  }

  async findAll() {
    return this.offerRepository.find({ relations: ['item', 'user'] });
  }

  async findOne(id: number) {
    return this.offerRepository.findOneBy({ id });
  }
}