import { Injectable }   from '@angular/core';
import { Http }         from '@angular/http';
import { last }         from 'rxjs/operator/last';

@Injectable()
export class FirebaseService{

    constructor(private _http: Http) {
    }

    getMorpheuzDataOfUserAtDate(date: Date){
        var year: String = ""+date.getFullYear();
        var month:string  = ("0" + (date.getMonth()+1)).slice(-2);
        var day: String = ("0" + date.getDate()).slice(-2);
        return this._http.get('getMorpheuzDataAtDate?date='+year+'-'+month+'-'+day).map(response => response.json());
    }

    getMorpheuzDaysWithData(){
        return this._http.get('getMorpheuzDaysWithData').map(response => response.json());
    }
}