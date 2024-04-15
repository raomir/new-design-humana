import { Injectable } from '@angular/core';
import { StorageServiceImpl } from '../../port/in/storage/storage.service';
import * as CryptoJS from 'crypto-js';
import SecureStorage from 'secure-web-storage';

 
const SECRET_KEY: any = 'Ber1g0';
@Injectable({
  providedIn: 'root'
})
export class StorageService implements StorageServiceImpl {
 
  constructor() { }
  public secureStorage = new SecureStorage(localStorage, {
    hash: function hash(key: string | any) {
      key = CryptoJS.SHA256(key, SECRET_KEY);
 
      return key.toString();
    },
    encrypt: function encrypt(data: any) {
      data = CryptoJS.AES.encrypt(data, SECRET_KEY);
 
      data = data.toString();
 
      return data;
    },
    decrypt: function decrypt(data: any) {
      data = CryptoJS.AES.decrypt(data, SECRET_KEY);
 
      data = data.toString(CryptoJS.enc.Utf8);
 
      return data;
    }
  });
 
}