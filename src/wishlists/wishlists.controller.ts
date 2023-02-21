import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

//only for registered users
@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

// create new wishlist
  @Post()
  create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  //find all owner wishlists
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

// get wishList by Id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

// update wishList
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistsService.update(+id, updateWishlistDto);
  }

// delete wishList
  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.wishlistsService.removeOne(+id);
  }
}