import React from 'react';
import { Select, Col, Row, Radio } from 'antd';
import './Calendar2.css'
/**
*Calendar 日历组件
*@param currentDate {Date} 展示日历，默认当天
*@param onChange {function(date: Date)} 日期变化的回调
*@param dateCellRender{function(date: Date): ReactNode} 自定义渲染日期单元格，返回内容会被追加到单元格
*/
const { Option } = Select;
const { Group, Button } = Radio;

//周名称
const WEEK_NAMES = ['一', '二', '三', '四', '五', '六', '日'];
//月份
const MONTH_NAMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
// 日历行数
let LINES = [1, 2, 3, 4, 5, 6];

export default class Calendar2 extends React.Component {
	state = {
		year: 0,
		month: 0,
		day: 0,
		mode: 'week', // 模式：周、月、年
		yearRange: [] // 年份范围
	}
	// 更新日期
	componentWillMount() {
		this.setCurrentYearMonth(this.props.currentDate);
	}
	componentDidUpdate(prevProps) {
		let prevDate = prevProps.currentDate;
		let prevDay = Calendar2.getDate(prevDate);
		let prevMonth = Calendar2.getMonth(prevDate);
		let prevYear = Calendar2.getFullYear(prevDate);
		let currentDate = this.props.currentDate;
		let currentDay = Calendar2.getDate(currentDate);
		let currentMonth = Calendar2.getMonth(currentDate);
		let currentYear = Calendar2.getFullYear(currentDate);
		// 如果日期发生了变化就更新日期
		if (prevDay !== currentDay || prevMonth !== currentMonth || prevYear !== currentYear) {
			this.setCurrentYearMonth(currentDate);
		}
	}
	//  设置当前组件的年月
	setCurrentYearMonth(date) {
		let day = Calendar2.getDate(date);
		let month = Calendar2.getMonth(date);
		let year = Calendar2.getFullYear(date);
		let yearRange = Calendar2.getYearRange(year);
		Calendar2.lineNumbers(year, month, day, this.state.mode);
		this.setState({
			day,
			month,
			year,
			yearRange
		})
	}
	// 获取当前日
	static getDate(date) {
		return date.getDate();
	}
	// 获取当前月份
	static getMonth(date) {
		return date.getMonth();
	}
	// 获取当前年份
	static getFullYear(date) {
		return date.getFullYear();
	}
	// 获取年份范围 以当前年份前后推10年
	static getYearRange(year) {
		let yearRange = [];
		let startYear = year - 10;
		let endYear = year + 10;
		for (let i = startYear; i <= endYear; i++) {
			yearRange.push(i);
		}
		return yearRange;
	}

	// 根据年份和月份获取对应月份的总天数
	static getCurrentMonthDays(year, month) {
		const curMonthDays = new Date(year, month + 1, 0).getDate();
		return curMonthDays;
	}

	// 这里获得每个月的第一天是周几
	static getWeeksByFirstDay(year, month) {
		let date = Calendar2.getDateByYearMonth(year, month);
		return date.getDay();
	}

	// 获取当天是周几
	static getWeeksByDay(year, month, day) {
		let date = Calendar2.getDateByYearMonth(year, month, day);
		return date.getDay();
	}

	// 设置日期行数
	static lineNumbers(year, month, day, mode) {
		if (mode === 'month') {
			// 当前月份的总天数
			let monthDays = Calendar2.getCurrentMonthDays(year, month);
			// 当前月份的第一天是周几
			let weekDay = Calendar2.getWeeksByFirstDay(year, month);
			if (monthDays === 28 && weekDay === 1) {
				LINES = [1, 2, 3, 4];
			} else if ((monthDays === 30 && weekDay === 0) || (monthDays === 31 && (weekDay === 0 || weekDay === 6))) {
				LINES = [1, 2, 3, 4, 5, 6];
			} else {
				LINES = [1, 2, 3, 4, 5];
			}
		} else if (mode === 'week') {
			let weekDay = Calendar2.getWeeksByDay(year, month, day);
			LINES = weekDay === 1 ? [1] : [1, 2];
		}
	}
	// 日期展示文本
	getDayText(line, weekIndex, weekDay, monthDays, mode) {
		let year = this.state.year;
		let month = this.state.month;
		//    				 一 二 三 四 五 六 日
		// getDay()对应的值： 1  2  3  4  5  6  0
		let _weekDay = weekDay;
		// 如果月份的第一天为周日，那么调整该值
		if (weekDay === 0) {
			_weekDay = 7;
		}
		let number;
		// 月模式
		if (mode === 'month') {
			number = line * 7 + weekIndex - _weekDay + 2;
			if (number <= 0) { // 上一个月
				// 如果是一月份， 那么上个月就是去年的12月份
				if (month === 0) {
					year = year - 1;
					month = 11;
				} else {
					month = month - 1;
				}
				// 获取上一个月的总天数
				let preMonthDays = Calendar2.getCurrentMonthDays(year, month);
				number = preMonthDays + number;
			} else if (number > monthDays) { // 下个月
				if (month === 11) {
					year = year + 1;
					month = 0;
				} else {
					month = month + 1;
				}
				number = number + monthDays;
			}
		} else { // 周模式
			const day = this.state.day;
			number = line * 7 + weekIndex - _weekDay + 1 + day;
			if (number > monthDays && number <= (day + 6)) {
				if (month === 11) {
					year = year + 1;
					month = 0;
				} else {
					month = month + 1;
				}
				number = number - monthDays;
			} else if (number < day || number > (day + 6)) {
				return '';
			}
		}
		return year + '-' + month + '-' + number;
	}
	// 获取当前月份某一天的日期，默认第一天
	static getDateByYearMonth(year, month, day = 1) {
		let _day = day;
		// 获取当前月份的总天数
		let curMonthDays = this.getCurrentMonthDays(year, month);
		// 如果 day大于当天月份的总天数，则day的值为当天月份的总天数，例如，5月31日切换到4月份则为4月30日， 因为4月没有31日：5.31 => 4.30
		if (_day > curMonthDays) {
			_day = curMonthDays;
		}
		let date = new Date();
		date.setFullYear(year);
		date.setMonth(month, _day);
		return date;
	}
	// 切换模式：周、月、年
	onModeChange = value => {
		const { year, month, day } = this.state;
		Calendar2.lineNumbers(year, month, day, value);
		this.setState({ mode: value });
	}
	// 选中日期
	onClickDay = (dayText, mode) => {
		let dayTextList = dayText.split('-');
		let year = dayTextList[0] - 0;
		let month = dayTextList[1] - 0;
		let day = dayTextList[2] - 0;
		let currentDate = new Date(year, month, day);
		Calendar2.lineNumbers(year, month, day, mode);
		this.props.onChange(currentDate);
	}
	// 年份下拉框选择
	selectYear = year => {
		const { month, day } = this.state;
		let currentDate = new Date(year, month, day);
		this.props.onChange(currentDate);
	}
	// 月份选择
	selectMonth = month => {
		const { year, day } = this.state;
		let currentDate = new Date(year, month, day);
		this.props.onChange(currentDate);
	}

	monthDom = month => {
		return (
			<td
				onClick={() => { this.selectMonth(month) }}
				style={{
					backgroundColor: this.state.month === month ? '#E0FFFF' : 'white',
					color: this.state.month === month ? '#33CCFF' : '#000',
					cursor: 'pointer'
				}}
			>
				{`${month + 1}月`}
			</td>
		)
	}
	// 将年月日转换成对应的日期类型
	getDateType = (year, month, dayText) => {
		if (typeof dayText === 'number') {
			return new Date(year, month, dayText);
		}
	}

	render() {
		let { day, year, month, mode, yearRange } = this.state;
		// 当前月份的总天数
		let monthDays = Calendar2.getCurrentMonthDays(year, month);
		// 周模式
		let weekDay = mode === 'week' ? Calendar2.getWeeksByDay(year, month, day) : Calendar2.getWeeksByFirstDay(year, month);
		const { style, dateCellRender } = this.props;
		return (
			<div>
				<table cellPadding={0} cellSpacing={0} className="table" style={style}>
					<caption>
						<div style={{ padding: 10 }}>
							<Row type="flex" justify="end">
								<Col span={4}>
									<Select
										dropdownMatchSelectWidth={false}
										className="my-year-select"
										onChange={this.selectYear}
										value={year}
									>
										{yearRange.map(item => <Option key={item} value={item}>{`${item}年`}</Option>)}
									</Select>
								</Col>
								<Col span={4}>
									<Select
										dropdownMatchSelectWidth={false}
										onChange={this.selectMonth}
										value={month}
									>
										{MONTH_NAMES.map(item => <Option key={item} value={item}>{`${item + 1}月`}</Option>)}
									</Select>
								</Col>
								<Col span={7}>
									<Group
										onChange={e => this.onModeChange(e.target.value)}
										value={mode}
									>
										<Button value='week'>周</Button>
										<Button value='month'>月</Button>
										<Button value='year'>年</Button>
									</Group>
								</Col>
							</Row>
						</div>
					</caption>
					<thead>
						{mode !== 'year' ? (
							<tr>
								{
									WEEK_NAMES.map((week, key) => {
										return <td key={key}>{week}</td>
									})
								}
							</tr>
						) : null}
					</thead>
					{(mode === 'month' || mode === 'week') ? (
						// 周和月模式
						<tbody>
							{
								LINES.map((item, key) => {
									return <tr key={key} className='mwTr'>
										{
											WEEK_NAMES.map((week, index) => {
												let dayText = this.getDayText(key, index, weekDay, monthDays, mode);
												let year_ = year, month_ = month, day_, dayTextList;
												if (dayText.indexOf('-') > -1) {
													dayTextList = dayText.split('-');
													year_ = dayTextList[0] - 0;
													month_ = dayTextList[1] - 0;
													day_ = dayTextList[2] - 0;
												} else {
													day_ = <span>&nbsp;</span>
												}
												let isToday = day_ === day && month_ === month; // 判断是否是当天日期或者是选中的日期
												let isCurrentMonth = month_ === month; // 判断是否是当前月的日期；
												let hoverStyle = typeof day_ === 'number' ? 'hoverStyle' : 'noHover';
												let todayStyle = isToday ? 'isToday' : 'noToday';
												return (
													<td
														key={index}
														onClick={() => { this.onClickDay(dayText, mode) }}
														title={typeof day_ === 'number' ? `${year_}年${month_ + 1}月${day_}日` : null}
														className={`${hoverStyle} ${todayStyle}`}
													>
														<div className={`day ${isCurrentMonth ? '' : 'grayColor'}`}>{day_ < 10 ? '0' + day_ : day_}</div>
														<div className='context'>{typeof dateCellRender === 'function' && dateCellRender(this.getDateType(year_, month_, day_))}</div>
													</td>
												)
											})
										}
									</tr>
								})
							}
						</tbody>
					) : (
						// 年模式
						<tbody>
							<tr className='yearTr'>
								{this.monthDom(0)}
								{this.monthDom(1)}
								{this.monthDom(2)}
							</tr>
							<tr className='yearTr'>
								{this.monthDom(3)}
								{this.monthDom(4)}
								{this.monthDom(5)}
							</tr>
							<tr className='yearTr'>
								{this.monthDom(6)}
								{this.monthDom(7)}
								{this.monthDom(8)}
							</tr>
							<tr className='yearTr'>
								{this.monthDom(9)}
								{this.monthDom(10)}
								{this.monthDom(11)}
							</tr>
						</tbody>
					)}
				</table>
			</div>
		)
	}
}