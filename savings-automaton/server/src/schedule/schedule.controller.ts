import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/currentUser';
import { CreateScheduleDto } from 'src/schedule/dto/createSchedule.dto';
import { User } from 'src/user/dto/user.dto';
import { nextRunDate } from 'src/utils/dateUtils';
import { ScheduleService } from './schedule.service';

@UseGuards(AuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Post()
  create(@Body() schedule: CreateScheduleDto, @CurrentUser() user: User) {
    const at = new Date(schedule.startDate);
    const nextRunAt = nextRunDate(at, schedule.frequency);
    this.scheduleService.create({
      user: { connect: { id: user.id } },
      nextRunAt,
      ...schedule,
    });
  }

  //  @Put(':id')
  //  update(
  //    @Param('id') id: number,
  //    @Body() schedule: UpdateScheduleDto,
  //    @CurrentUser() user: User,
  //  ) {}
  //
  //  @Delete(':id')
  //  delete(@Param('id') id: number, @CurrentUser() user: User) {
  //  }
}
