import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  users:any=[
    {
      id_chat:1,
      msg:'Mensaje 1',
      name:'john doe',
      img:'https://vignette.wikia.nocookie.net/roblox-characters/images/4/4d/68cba9a75191d53c8994fd8950763f20.png/revision/latest/scale-to-width-down/340?cb=20170507155708&path-prefix=es'
    },{
      id_chat:2,
      msg:'Mensaje 2',
      name:'Jane doe',
      img:'https://vignette.wikia.nocookie.net/roblox-characters/images/4/4d/68cba9a75191d53c8994fd8950763f20.png/revision/latest/scale-to-width-down/340?cb=20170507155708&path-prefix=es'
    },{
      id_chat:3,
      msg:'Mensaje 3',
      name:'Pepe pica',
      img:'https://vignette.wikia.nocookie.net/roblox-characters/images/4/4d/68cba9a75191d53c8994fd8950763f20.png/revision/latest/scale-to-width-down/340?cb=20170507155708&path-prefix=es'
    },{
      id_chat:4,
      msg:'Mensaje 4',
      name:'Juanita',
      img:'https://vignette.wikia.nocookie.net/roblox-characters/images/4/4d/68cba9a75191d53c8994fd8950763f20.png/revision/latest/scale-to-width-down/340?cb=20170507155708&path-prefix=es'
    },{
      id_chat:5,
      msg:'Mensaje 5',
      name:'Perengano',
      img:'https://vignette.wikia.nocookie.net/roblox-characters/images/4/4d/68cba9a75191d53c8994fd8950763f20.png/revision/latest/scale-to-width-down/340?cb=20170507155708&path-prefix=es'
    },
  ]

  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  chatId=null;

  chat(id: number) {
    //this.router.navigate(['chat-list/chat', id]);
    console.log(id)
    this.chatId=id
  }

  receiveMessage($event) {
    this.chatId = $event
  }


}
