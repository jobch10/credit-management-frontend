import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/config';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService<User, number>{
  protected override endpoint = 'usuarios';

}
