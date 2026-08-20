import {
    Injectable,
    inject,
} from '@angular/core'

import { HttpClient } from '@angular/common/http'

import {
    Observable,
    map,
    catchError,
    of,
} from 'rxjs'


interface PaisApi {
    country: string
}

interface RespuestaPaisesApi {
    error: boolean
    msg: string
    data: PaisApi[]
}


@Injectable({
    providedIn: 'root',
})
export class PaisService {
    private readonly http =
        inject(HttpClient)

    private readonly apiUrl =
        'https://countriesnow.space/api/v0.1/countries'


    obtenerPaises(): Observable<string[]> {
        return this.http
            .get<RespuestaPaisesApi>(this.apiUrl)
            .pipe(
                map((respuesta) =>
                    respuesta.data
                        .map((p) => p.country)
                        .sort((a, b) =>
                            a.localeCompare(b)
                        )
                ),
                catchError(() => of([]))
            )
    }
}