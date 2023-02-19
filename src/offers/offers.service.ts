import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
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
// create offer method
async create(createOfferDto: CreateOfferDto, user: User) {
    const offer = this.offersRepository.create({
      ...createOfferDto,
      user,
          })
    return offer;
  }

  async findAll() {
    return null
  }

  async findOne(id: number): Promise<Offer> {
    return this.offersRepository.findOneBy({ id });
  }

  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    return null
  }

  async remove(id: number) {
    const deletedOffer = await this.findOne(id);
    await this.offersRepository.delete(id);
    return deletedOffer;
  }
}