export interface EventData {
    date: Date;
    duration: number;
    title: string;
    subTitle: string;
    location: string;
    description: string;
    type: string;
    color: string;
}


export const eventsData: EventData[] = [
    {
        date: new Date(2024, 4, 17, 9, 0),
        duration: 2,
        title: "Event 1",
        subTitle: "Subtitle 1",
        location: "Location 1",
        description: "Description 1",
        type: "Type 1",
        color: "#F0A975" 
    },
    {
        date: new Date(2024, 4, 17, 10, 0),
        title: "Event 2",
        duration: 1.5,
        subTitle: "Subtitle 2",
        location: "Location 2",
        description: "Description 2",
        type: "Type 2",
        color: "#23BCCA"
    },
    {
        date: new Date(2024, 4, 18, 12, 0),
        title: "Event 3",
        duration: 1.5,
        subTitle: "Subtitle 2",
        location: "Location 2",
        description: "Description 2",
        type: "Type 2",
        color: "#3160D9" 
    },{
        date: new Date(2024, 4, 19, 10, 0),
        title: "Event 4",
        duration: 1.5,
        subTitle: "Subtitle 2",
        location: "Location 2",
        description: "Description 2",
        type: "Type 2",
        color: "#AB8FF9" 
    },
    {
        date: new Date(2024, 4, 19, 12, 0),
        title: "Event 5",
        duration: 1.5,
        subTitle: "Subtitle 2",
        location: "Location 2",
        description: "Description 2",
        type: "Type 2",
        color: "#F07584" 
    }
    
];
