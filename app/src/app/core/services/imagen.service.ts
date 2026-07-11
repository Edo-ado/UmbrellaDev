import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ImagenUploadResponse {
  message: string;
  fileName: string;
}

@Injectable({ providedIn: 'root' })
export class ImageService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/images';

  upload(file: File, previousFileName?: string): Observable<ImagenUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    if (previousFileName) {
      formData.append('previousFileName', previousFileName);
    }
    return this.http.post<ImagenUploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  getUrl(fileName: string): string {
    return `${this.apiUrl}/download/${fileName}`;
  }
}