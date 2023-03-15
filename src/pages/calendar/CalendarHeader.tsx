import { Col, Row, Select, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import localeData from 'dayjs/plugin/localeData'

const { Title } = Typography;

dayjs.extend(localeData);

export default function CalendarHeader({value, onChange}:{ value: Dayjs, onChange: (n:Dayjs) => void}) {
    const start = 0;
    const end = 12;
    const monthOptions = [];

    let current = value.clone();
    const localeData = value.localeData();
    const months = [];
    for (let i = 0; i < 12; i++) {
      current = current.month(i);
      months.push(localeData.monthsShort(current));
    }

    for (let i = start; i < end; i++) {
      monthOptions.push(
        <Select.Option key={i} value={i} className="month-item">
          {months[i]}
        </Select.Option>,
      );
    }

    const year = value.year();
    const month = value.month();
    const options = [];
    for (let i = year - 10; i < year + 10; i += 1) {
      options.push(
        <Select.Option key={i} value={i} className="year-item">
          {i}
        </Select.Option>,
      );
    }
    return (
        <>
            <Row gutter={8} style={{justifyContent: 'space-between',alignItems: 'center', padding: '0 30px', background: 'transparent'}}>
            <Title level={4}>Monthly Outfit ❤️</Title>
                <div style={{display:'flex'}}>
                    <Col>
                        <Select
                            value={year}
                            onChange={(newYear) => {
                                const now = value.clone().year(newYear);
                                onChange(now);
                            }}
                            >
                            {options}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            value={month}
                            onChange={(newMonth) => {
                                const now = value.clone().month(newMonth);
                                onChange(now);
                            }}
                            >
                            {monthOptions}
                        </Select>
                    </Col>
                </div>
            </Row>
        </>
    );
}