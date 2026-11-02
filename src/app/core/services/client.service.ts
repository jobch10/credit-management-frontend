import { Injectable } from '@angular/core';
import { Client } from '../../shared/interfaces/actors';
import { GenericService } from './generic.service';

@Injectable({
    providedIn: 'root'
})
export class ClientService extends GenericService<Client, number> {
    protected override endpoint = 'clients';
}
