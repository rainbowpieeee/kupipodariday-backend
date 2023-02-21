import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
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
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly userService: UsersService,
    private readonly wishesService: WishesService, 
    private readonly emailService: EmailSenderService
  ) {}

  async createOne(createOfferDto: CreateOfferDto, user: User) {
    const currentUser = await this.userService.findOne(user.id);   
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (currentUser.id === wish.owner.id) {
      throw new BadRequestException('Нельзя вносить деньги на собственные подарки');
    } else
    if ( wish.raised + createOfferDto.amount > wish.price) {
      throw new BadRequestException('Сумма собранных средств не может превышать стоимость подарка. Предложите сумму меньше');
    }

    await this.wishesService.update(wish.id, { raised: wish.raised + createOfferDto.amount})

    const offer = this.offersRepository.create({...createOfferDto, user, item: wish});   
    const savedOffer = await this.offersRepository.save(offer);
    const updatedWish = await this.wishesService.findOne(createOfferDto.itemId);

    if (updatedWish.raised === updatedWish.price) {
      const emails = updatedWish.offers.map((offer) => offer.user.email);
      await this.emailService.sendEmail(emails, updatedWish);
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