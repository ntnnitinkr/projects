import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Image } from '../../model/image';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MessageBoxButton, MessageBox } from 'src/app/shared/message-box';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styles: ['./image.component.css']
})
export class ImageComponent implements OnInit {

    fileData: File = null;
    previewUrl:any = null;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    constructor(
    private service: PatientService,
    private router: Router,
    private dialog: MatDialog) {}

    ngOnInit() {
    }
    
    //fileProgress(fileInput: any) {
    //    this.fileData = <File>fileInput.target.files[0];
    //    this.preview();
    //}
     
    preview() {
        // Show preview 
        var mimeType = this.fileData.type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }
    
        var reader = new FileReader();      
        reader.readAsDataURL(this.fileData); 
        reader.onload = (_event) => { 
          this.previewUrl = reader.result; 
        }
    }
    
    fileProgress(files: FileList){
        this.fileData = files.item(0);;
        this.preview();
    }
    
    onSubmit() {
        //const formData = new FormData();
        //formData.append('file', this.fileData);
        //this.service.post('url/to/your/api', formData)
        //    .subscribe(res => {
        //      console.log(res);
        //      this.uploadedFilePath = res.data.filePath;
        //      alert('SUCCESS !!');
        //}) 
        //const formData = new FormData();  
        //formData.append('file', this.fileData); 
        
        //console.log(this.fileData);
        
        this.service.imageResult(this.fileData).subscribe(
            response => {
        
            this.uploadedFilePath = response;
            console.log(response);
          },
          error => {
              console.log(error);
          }
        );
    }

}