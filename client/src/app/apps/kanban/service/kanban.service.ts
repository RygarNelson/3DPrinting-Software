import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {KanbanCardType, KanbanListType} from '@/types/kanban';

@Injectable()
export class KanbanService {
    private _lists: KanbanListType[] = [];

    private selectedCard = new Subject<KanbanCardType>();

    private selectedListId = new Subject<string>();

    private lists = new BehaviorSubject<KanbanListType[]>(this._lists);

    private listNames = new Subject<any[]>();

    lists$ = this.lists.asObservable();

    selectedCard$ = this.selectedCard.asObservable();

    selectedListId$ = this.selectedListId.asObservable();

    listNames$ = this.listNames.asObservable();

    constructor(private http: HttpClient) {
        this.http
            .get<any>('/demo/data/kanban.json')
            .toPromise()
            .then((res) => res.data as KanbanListType[])
            .then((data) => {
                this.updateLists(data);
            });
    }

    private updateLists(data: any[]) {
        this._lists = data;
        let small = data.map((l) => ({ listId: l.listId, title: l.title }));

        this.listNames.next(small);
        this.lists.next(data);
    }

    addList() {
        const listId = this.generateId();
        const title = 'Untitled List';
        const newList = {
            listId: listId,
            title: title,
            cards: []
        };

        this._lists.push(newList);
        this.lists.next(this._lists);
    }

    addCard(listId: string) {
        const cardId = this.generateId();
        const title = 'Untitled card';
        const newCard = { id: cardId, title: title, description: '', progress: '', assignees: [], attachments: 0, comments: [], startDate: '', dueDate: '', completed: false, taskList: { title: 'Untitled Task List', tasks: [] } };

        let lists = [];
        lists = this._lists.map((l) => (l.listId === listId ? { ...l, cards: [...(l.cards || []), newCard] } : l));
        this.updateLists(lists);
    }

    updateCard(card: KanbanCardType, listId: string) {
        let lists = this._lists.map((l) => (l.listId === listId ? { ...l, cards: l.cards.map((c: any) => (c?.id === card.id ? { ...card } : c)) } : l));
        this.updateLists(lists);
    }

    deleteList(id: string) {
        this._lists = this._lists.filter((l) => l.listId !== id);
        this.lists.next(this._lists);
    }

    copyList(list: KanbanListType) {
        let newId = this.generateId();
        let newList = { ...list, listId: newId };

        this._lists.push(newList);
        this.lists.next(this._lists);
    }

    deleteCard(cardId: string, listId: string) {
        let lists = [];

        for (let i = 0; i < this._lists.length; i++) {
            let list = this._lists[i];

            if (list.listId === listId && list.cards) {
                list.cards = list.cards.filter((c) => c.id !== cardId);
            }

            lists.push(list);
        }

        this.updateLists(lists);
    }

    copyCard(card: KanbanCardType, listId: string) {
        let lists = [];

        for (let i = 0; i < this._lists.length; i++) {
            let list = this._lists[i];

            if (list.listId === listId && list.cards) {
                let cardIndex = list.cards.indexOf(card);
                let newId = this.generateId();
                let newCard = { ...card, id: newId };
                list.cards.splice(cardIndex, 0, newCard);
            }

            lists.push(list);
        }

        this.updateLists(lists);
    }

    moveCard(card: KanbanCardType, targetListId: string, sourceListId: string) {
        if (card.id) {
            this.deleteCard(card.id, sourceListId);
            let lists = this._lists.map((l) => (l.listId === targetListId ? { ...l, cards: [...(l.cards || []), card] } : l));
            this.updateLists(lists);
        }
    }

    onCardSelect(card: KanbanCardType, listId: string) {
        this.selectedCard.next(card);
        this.selectedListId.next(listId);
    }

    generateId() {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    isMobileDevice() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || /(android)/i.test(navigator.userAgent);
    }
}
