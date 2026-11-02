import { CreditProfile } from '@/app/shared/models';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { ApiResponse } from '../models';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CreditProfileService extends GenericService<CreditProfile, number> {
    protected override endpoint = 'credit-profiles';
}
