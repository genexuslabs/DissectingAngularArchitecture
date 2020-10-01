
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { Type, Transform } from 'class-transformer';

export class sdtMeetingData {
  @Type(() => Number) MeetingId: number;


  constructor() {
    this.MeetingId = 0;

  }
}

