import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
   /*logger: Logger;
  constructor() {
    this.logger = new Logger(AppService.name);
  }*/

  getStarted(): string {    
    //this.logger.debug('test');
    return 'Server started!';
  }
}