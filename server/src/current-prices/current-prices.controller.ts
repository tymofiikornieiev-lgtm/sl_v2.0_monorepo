import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentPricesService } from './current-prices.service';
import { CreateCurrentPriceDto } from './dto/create-current-price.dto';
import { UpdateCurrentPriceDto } from './dto/update-current-price.dto';
import { SearchCurrentPriceDto } from './dto/search-current-price.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/interfaces/user-role.interface';

@Controller('current-prices')
export class CurrentPricesController {
  constructor(private readonly currentPricesService: CurrentPricesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findAll(@Query() query: SearchCurrentPriceDto) {
    return await this.currentPricesService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.currentPricesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async createCurrentPrice(
    @Body() createCurrentPriceDto: CreateCurrentPriceDto,
  ) {
    return await this.currentPricesService.createCurrentPrice(
      createCurrentPriceDto,
    );
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async updateCurrentPrice(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurrentPriceDto: UpdateCurrentPriceDto,
  ) {
    return this.currentPricesService.updateCurrentPrice(
      id,
      updateCurrentPriceDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.currentPricesService.remove(id);
  }

  //
  // UPSERT CONTROLLER
  // @Post('upsert')
  // public async upsertCurrentPrice(
  //   @Body() createCurrentPriceDto: CreateCurrentPriceDto,
  // ) {
  //   return await this.currentPricesService.upsertCurrentPrice(
  //     createCurrentPriceDto,
  //   );
  // }
}
