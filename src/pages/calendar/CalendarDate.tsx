import dayjs, { Dayjs } from "dayjs";
import { ClothItem } from "../../index.d";

interface CalendarDateProps {
    selectedDay: Dayjs,
    ootdDocument: ClothItem[] | null
}

const getListData = (value: Dayjs, ootdDocument: ClothItem[] | null) => {
    if (ootdDocument) {
        const filter = ootdDocument.filter(d => d.id === dayjs(value).format('YYYYMMDD'))
        let savedOutfit;
        if (filter.length > 0) {
            savedOutfit = Object.values(filter[0])
                .filter(item => item instanceof Object && 'title' in item) as ClothItem[]
        }
        return savedOutfit ? savedOutfit : []
    } else {
        return []
    }
};

export default function CalendarDate ({selectedDay, ootdDocument}: CalendarDateProps) {
    const listData = getListData(selectedDay, ootdDocument);

    return (
        <ul style={{padding: 0, background: 'transparent'}}>
            {
                listData.map((item) => (
                    <img key={`calendar-${item.id}`} src={item.image} width='30%' alt={item.title}/>
                ))
            }
        </ul>
    );
}