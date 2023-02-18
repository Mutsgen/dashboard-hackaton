import React, { useEffect, useState } from "react";
import styles from "./BudgetAllocationStatistic.module.css";
import BarChart from "../BarChart/BarChart.jsx";

function BudgetAllocationStatistic() {
	const [data, setData] = useState([]);
	const [currentRegion, setCurrentRegion] = useState(0);
	const [currentMetric, setCurrentMetric] = useState(0);

	const [keys, setKeys] = useState([]);
	const [values, setValues] = useState([]);
	const [label, setLabel] = useState("");

	const [sortedByRegion, setSortedByRegion] = useState([]);

	const metrics = [
		" Бюджет МО, руб ",
		" Бюджет СРФ, руб ",
		" Бюджет грантов, руб ",
		" Кол-во грантов ",
		" Количество детских и молодeжных общественных объединений, работающих по данному ",
		" Численность молодeжи, задействованной в программных мероприятиях по направлению ",
	];

	const [regions, setRegions] = useState([]);

	function chooseRegion(region) {
		let sortedByRegion1 = [];
		data.forEach((el) => {
			console.log(el);
			console.log(regions[region]);
			if (el["Регион"] == regions[region]) {
				sortedByRegion1.push(el);
			}
		});
		setSortedByRegion(sortedByRegion1);
	}

	useEffect(() => {
		async function getData() {
			const serverData = await fetch(
				"http://192.168.193.189:7000/dataset/page/cf2801fc-7e96-45b8-9b36-a9cefdcecb82.xlsx/xlsx/Р1",
				{
					method: "GET",
				}
			);
			const result = JSON.parse(await serverData.text());
			console.log(result);
			setData(result);

			const regionsData = await fetch(
				"http://192.168.193.189:7000/dataset/cf2801fc-7e96-45b8-9b36-a9cefdcecb82.xlsx/regions",
				{
					method: "GET",
				}
			);
			const regions = JSON.parse(await regionsData.text());
			setRegions(regions);
		}
		getData();
	}, []);

	useEffect(() => {
		let valuesToChart = [];
		let labelToChart = [];
		console.log(sortedByRegion);
		sortedByRegion.forEach((el, index) => {
			if (
				!el[
					"Направления реализации государственной молодeжной политики"
				].startsWith("  ")
			) {
				valuesToChart.push(el[metrics[currentMetric]]);
				if (
					!el[
						"Направления реализации государственной молодeжной политики"
					].endsWith(", в том числе:")
				) {
					labelToChart.push(
						el[
							"Направления реализации государственной молодeжной политики"
						]
					);
				} else {
					labelToChart.push(
						el[
							"Направления реализации государственной молодeжной политики"
						].replace(", в том числе:", "")
					);
				}
			}
			console.log(el);
		});
		setValues(valuesToChart);
		setKeys(labelToChart);
	}, [currentRegion, currentMetric, data]);

	return (
		<div className={styles.wrap}>
			<div className={styles.header}>
				<h1>Распределение бюджета</h1>
				<select
					className={styles.select}
					value={currentRegion}
					onChange={(e) => {
						setCurrentRegion(e.target.value);
						chooseRegion(e.target.value);
					}}
				>
					{regions.map((region, id) => {
						return (
							<option key={id} value={id}>
								{region}
							</option>
						);
					})}
				</select>

				<select
					className={styles.select}
					value={currentMetric}
					onChange={(e) => {
						setCurrentMetric(e.target.value);
					}}
				>
					{metrics.map((metric, id) => {
						return (
							<option key={id} value={id}>
								{metric}
							</option>
						);
					})}
				</select>
			</div>
			<BarChart
				width={700}
				height={500}
				data={{
					labels: keys,
					datasets: [
						{
							label,
							data: values,
						},
					],
				}}
				options={{
					responsive: true,
					// scales: {
					// 	y: {
					// 		ticks: {
					// 			display: false,
					// 		},
					// 	},
					// },
					plugins: {
						legend: false,
					},
					indexAxis: "y",
				}}
			/>
		</div>
	);
}

export default BudgetAllocationStatistic;
