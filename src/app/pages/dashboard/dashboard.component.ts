import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  percentDone: any;
  uploadSuccess: any;
  localStorgeDet: any;
  studentMarkDetails: any;
  studentDetails: any;

  head = [['SUBJECT', 'MAX MARKS', 'OBTAINED MARKS']]

  data = [
    [1, 'ROBERT', 'SOFTWARE DEVELOPER', 'ENGINEERING'],
    [2, 'CRISTINAO', 'QA', 'TESTING'],
    [3, 'KROOS', 'MANAGER', 'MANAGEMENT'],
    [4, 'XYZ', 'DEVELOPER', 'DEVLOPEMENT'],
    [5, 'ABC', 'CONSULTANT', 'HR'],
    [73, 'QWE', 'VICE PRESIDENT', 'MANAGEMENT'],
  ]

  constructor(private http: HttpClient,private route: Router) {
    let loc: any = localStorage.getItem('loginInfo');
    this.localStorgeDet = JSON.parse(loc)
  }

  ngOnInit(): void {
    console.log('this.localStorgeDet this.localStorgeDet', this.localStorgeDet);
    if (this.localStorgeDet.registrationId) this.getStuendtMarkDetail();
  }


  getStuendtMarkDetail() {
    console.log('in in')
    this.http.get(`http://localhost:8080/student/${this.localStorgeDet.registrationId}`)
      .subscribe((response: any) => {
        console.log('mark deta', response);
        this.studentMarkDetails = this.getMarkDetails(response[0])
        this.studentDetails = response[0];
      });
  }
  getMarkDetails(markRes: any) {
    console.log('markRes', markRes);
    let markDet = [{ Subject: 'English' }, { Subject: 'Tamil' }, { Subject: 'Maths' }, { Subject: 'Science' }, { Subject: 'Social_science' }, { Subject: 'TOTAL' }];
    markDet.forEach((elem: any) => {
      elem['Subject'] = elem.Subject;
      elem['Maxmark'] = elem.Subject == 'TOTAL' ? 500 : 100;
      elem['Obt_marks'] = markRes[elem.Subject];
    });
    return markDet;
  }

  uploadExcel(event: any) {
    console.log('event det', event.target.files[0]);

    const formData = new FormData();
    formData.append('uploadfile', event.target.files[0]);
    this.http.post('http://localhost:8080/api/uploadfile', formData, { reportProgress: true, observe: 'events' })
      .subscribe((response: any) => {
        if (response.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * response.loaded / response.total);
        } else if (response instanceof HttpResponse) {
          this.uploadSuccess = true;
          window.alert('uploaded successfully')
        }
      });
  }

  createPdf() {
    var doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Mark Details', 70, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);
    let mappedArr = this.studentMarkDetails.map(Object.values);
    console.log('mappedArr', mappedArr);
    (doc as any).autoTable({
      head: this.head,
      body: mappedArr,
      theme: 'plain',
      didDrawCell: (data: any) => {
        // console.log(data.column.index)
      }
    })

    // below line for Open PDF document in new tab
    doc.output('dataurlnewwindow')

    // below line for Download PDF document
    // doc.save(`${this.studentDetails.Name}.pdf`);
  }

  logout(){
    localStorage.clear();
    this.route.navigate(['/login']);
  }

}
