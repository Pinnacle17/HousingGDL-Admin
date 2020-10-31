import { Component, OnInit,Input  } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() childMessage: number;

  msgs:any=[
    {
      id_mensaje:1,
      mensaje:"Mensaje 1",
      fecha:new Date(1995,11,11),
      usuario:1,
      fk_chat:1
    },{
      id_mensaje:2,
      mensaje:"Mensaje 2",
      fecha:new Date(1995,11,12),
      usuario:0,
      fk_chat:1
    },{
      id_mensaje:3,
      mensaje:"Mensaje 3",
      fecha:new Date(1995,11,13),
      usuario:1,
      fk_chat:1
    },{
      id_mensaje:4,
      mensaje:"Mensaje 4",
      fecha:new Date(1995,11,14),
      usuario:0,
      fk_chat:1
    },{
      id_mensaje:5,
      mensaje:"Mensaje 5",
      fecha:new Date(1995,11,15),
      usuario:1,
      fk_chat:1
    },{
      id_mensaje:6,
      mensaje:"Mensaje 6",
      fecha:new Date(1995,11,16),
      usuario:0,
      fk_chat:1
    },{
      id_mensaje:7,
      mensaje:"Mensaje 7",
      fecha:new Date(1995,11,17),
      usuario:1,
      fk_chat:1
    },{
      id_mensaje:8,
      mensaje:"Mensaje 8",
      fecha:new Date(1995,11,18),
      usuario:0,
      fk_chat:1
    },{
      id_mensaje:9,
      mensaje:"Mensaje 9",
      fecha:new Date(1995,11,19),
      usuario:1,
      fk_chat:1
    },{
      id_mensaje:10,
      mensaje:"Mensaje 10",
      fecha:new Date(1995,11,20),
      usuario:0,
      fk_chat:1
    },
  ]

  constructor() {
    console.log('holi')
   }
  
  ngOnInit(): void {
    
  }

}
