import { SchedulerEvent } from '@progress/kendo-angular-scheduler';

/* tslint:disable */

const baseData: any[] = [
    {
        "TaskID": 4,
        "OwnerID": 2,
        "Title": "Bowling tournament",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-07-09T21:00:00.000Z",
        "End": "2013-06-10T00:00:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": null,
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 5,
        "OwnerID": 2,
        "Title": "Take the dog to the vet",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-06-10T07:00:00.000Z",
        "End": "2013-06-10T08:00:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": null,
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 6,
        "OwnerID": 2,
        "Title": "Call Charlie about the project",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-06-11T11:30:00.000Z",
        "End": "2013-06-11T13:00:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": null,
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 82,
        "OwnerID": 2,
        "Title": "Support Call",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-06-26T11:30:00.000Z",
        "End": "2013-06-26T12:00:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": null,
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 83,
        "OwnerID": 3,
        "Title": "Phone Sync with NY office ",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-06-26T13:30:00.000Z",
        "End": "2013-06-26T14:30:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": null,
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 84,
        "OwnerID": 3,
        "Title": "Phone Sync with Boston Office",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-06-26T15:00:00.000Z",
        "End": "2013-06-26T16:00:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": null,
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 85,
        "OwnerID": 3,
        "Title": "Server maintenance",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-06-26T18:30:00.000Z",
        "End": "2013-06-26T21:30:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": null,
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 86,
        "OwnerID": 2,
        "Title": "Status meeting",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-06-28T13:30:00.000Z",
        "End": "2013-06-28T15:30:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": null,
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 87,
        "OwnerID": 3,
        "Title": "Helpdesk status meeting",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-06-27T10:30:00.000Z",
        "End": "2013-06-29T11:30:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": null,
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 88,
        "OwnerID": 2,
        "Title": "Business Lunch",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-06-27T12:00:00.000Z",
        "End": "2013-06-27T13:00:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": null,
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 116,
        "OwnerID": 2,
        "Title": "Performance review",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-07-04T14:00:00.000Z",
        "End": "2013-07-04T17:00:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": "",
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 118,
        "OwnerID": 1,
        "Title": "HR seminar preparation",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-07-05T10:00:00.000Z",
        "End": "2013-07-07T12:00:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": "",
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 119,
        "OwnerID": 3,
        "Title": "Helpdesk weekly meeting",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-07-05T15:00:00.000Z",
        "End": "2013-07-05T16:00:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": "FREQ=WEEKLY;BYDAY=WE",
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    },
    {
        "TaskID": 120,
        "OwnerID": 3,
        "Title": "Website upload",
        "Description": "",
        "StartTimezone": null,
        "Start": "2013-07-07T07:00:00.000Z",
        "End": "2013-07-08T08:30:00.000Z",
        "EndTimezone": null,
        "RecurrenceRule": "",
        "RecurrenceID": null,
        "RecurrenceException": null,
        "IsAllDay": false
    }
];

const currentYear = new Date().getFullYear();
const parseAdjust = (eventDate: string): Date => {
    const date = new Date(eventDate);
    date.setFullYear(currentYear);
    return date;
};

// const randomInt = (min, max): number => {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

export const displayDate = new Date(currentYear, 7, 24);

export const sampleData = baseData.map(dataItem => (
    <SchedulerEvent> {
        id: dataItem.TaskID,
        start: parseAdjust(dataItem.Start),
        startTimezone: dataItem.startTimezone,
        end: parseAdjust(dataItem.End),
        endTimezone: dataItem.endTimezone,
        isAllDay: dataItem.IsAllDay,
        title: dataItem.Title,
        description: dataItem.Description,
        recurrenceRule: dataItem.RecurrenceRule,
        recurrenceId: dataItem.RecurrenceID,
        recurrenceException: dataItem.RecurrenceException,

        roomId: dataItem.RoomID,
        ownerID: dataItem.OwnerID
    }
));

export const sampleDataWithResources = baseData.map(dataItem => (
    <SchedulerEvent> {
        id: dataItem.TaskID,
        start: parseAdjust(dataItem.Start),
        startTimezone: dataItem.startTimezone,
        end: parseAdjust(dataItem.End),
        endTimezone: dataItem.endTimezone,
        isAllDay: dataItem.IsAllDay,
        title: dataItem.Title,
        description: dataItem.Description,
        recurrenceRule: dataItem.RecurrenceRule,
        recurrenceId: dataItem.RecurrenceID,
        recurrenceException: dataItem.RecurrenceException,
        // roomId: randomInt(1, 2),
        // attendees: [randomInt(1, 3)]
    }
));

export const sampleDataWithCustomSchema = baseData.map(dataItem => (
    {
        ...dataItem,
        Start: parseAdjust(dataItem.Start),
        End: parseAdjust(dataItem.End)
    }
));
