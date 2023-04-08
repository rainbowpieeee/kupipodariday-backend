import {
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guard';
  
@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}
  
@Post()
create(@Body() wishlist: CreateWishlistDto, @Req() req) {
  return this.wishlistsService.create(req.user, wishlist);
}
  
@Get()
findAll() {
  return this.wishlistsService.findAll();
}

@Get(':id')
findOne(@Param('id') id: string) {
  return this.wishlistsService.findOne(+id);
}

@Patch(':id')
update(
  @Param('id') id: string,
  @Body() wishlist: UpdateWishlistDto,
  @Req() req,
) {
  return this.wishlistsService.update(+id, wishlist, req.user.id);
}

@Delete(':id')
remove(@Param('id') wishListId: string, @Req() req) {
  return this.wishlistsService.remove(+wishListId, req.user.id);
  }
}