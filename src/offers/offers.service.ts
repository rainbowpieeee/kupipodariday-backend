import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
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

  async createOne(createOfferDto: CreateOfferDto, user: User) {
    const currentUser = await this.userService.findOne(user.id);
    //console.log('currentUser', currentUser);    
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    //console.log('wish', wish);

    if (currentUser.id === wish.owner.id) {
      throw new BadRequestException('Нельзя вносить деньги на собственные подарки');
    } else
    if ( wish.raised + createOfferDto.amount > wish.price) {
      throw new BadRequestException('Сумма собранных средств не может превышать стоимость подарка. Предложите сумму меньше');
    }

    const updatedWish = await this.wishesService.update(wish.id, { raised: wish.raised + createOfferDto.amount})
    //console.log('updated wish', updatedWish);

    const offer = this.offersRepository.create({...createOfferDto, user, item: wish});
    //console.log('offer', offer);

    const savedOffer = await this.offersRepository.save(offer);

    //TODO email sender
    if (updatedWish.raised === updatedWish.price) {
      console.log('Send emails')
    }

    return savedOffer;
  }

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find({relations: ['item', 'user']})
  }

  async findOne(id: number): Promise<Offer> {
    return this.offersRepository.findOne({ where: { id }, relations: ['item', 'user']});
  }

  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<any> {
    return this.offersRepository.update(id, updateOfferDto);
  }

  async remove(id: number) {
    const deletedOffer = await this.findOne(id);
    await this.offersRepository.delete(id);
    return deletedOffer;
  }
}