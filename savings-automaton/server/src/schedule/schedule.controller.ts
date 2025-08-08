import {
  Body,
  Delete,
  Post,
  Put,
  Controller,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateScheduleDto } from 'src/schedule/dto/createSchedule.dto';
import { CurrentUser } from 'src/auth/currentUser';
import { User } from 'src/user/dto/user.dto';
import { UpdateScheduleDto } from 'src/schedule/dto/updateSchedule.dto';

@UseGuards(AuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Post()
  async create(@Body() schedule: CreateScheduleDto, @CurrentUser() user: User) {
    const at = new Date(schedule.startDate);
    let nextRunAt: Date;
    switch (schedule.frequency) {
      case 'Daily':
        nextRunAt = new Date(new Date(at).setDate(at.getDate() + 1));
        break;
      case 'Weekly':
        nextRunAt = new Date(new Date(at).setDate(at.getDate() + 7));
        break;
      case 'Monthly':
        nextRunAt = new Date(new Date(at).setMonth(at.getMonth() + 1));
        break;
      default:
        nextRunAt = new Date(new Date(at).setMonth(at.getMonth() + 1));
        break;
    }
    this.scheduleService.create({
      user: { connect: { id: user.id } },
      nextRunAt,
      ...schedule,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() schedule: UpdateScheduleDto,
    @CurrentUser() user: User,
  ) {}

  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentUser() user: User) {}
}
