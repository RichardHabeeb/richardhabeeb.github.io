import { splitProps, createSignal, onMount } from "solid-js"
import { Dynamic } from "solid-js/web";
import { ResponsiveImage } from '@responsive-image/solid';
import headshot from './assets/richard_habeeb.jpg?w=256;512;1024&quality=40&format=original;avif&responsive'
import headerBackground from './assets/IMG_4890.jpg?w=3984;2048;1024&quality=40&format=avif;original&responsive'
import contentBackground from './assets/64-50-5-monochrome.png?w=64&format=avif;original&responsive'
import background from './assets/nhv.jpg?w=4096;2048;1024&quality=40&format=avif;original&responsive'
import styles from './App.module.css'
import education from './education.json'
import publications from './publications.json'

function ResponsiveBackground(props) {
	let thisElement;

	const [myProps, restProps] = splitProps(
		props,
		["src", "children", "width", "tag"],
	);

	const [width, setWidth] = createSignal(document.body.clientWidth);
	if(myProps.width !== undefined) {
		setWidth(myProps.width);
	} else {
		onMount(() => {
			const resizeObserver = new ResizeObserver((elems) => {
				setWidth(thisElement.offsetWidth);
			});
			resizeObserver.observe(thisElement);
		});
	}


	const fallbackBackgroundURL = myProps.src.imageUrlFor();
	const imageSet = props.src.imageTypes.map((t) =>
		`url("${myProps.src.imageUrlFor(2*width(), t)}") 2x type("image/${t}"), ` +
		`url("${myProps.src.imageUrlFor(width(), t)}") 1x type("image/${t}")`
	).join(", ");

	return (
		<Dynamic component={props.tag}
				ref={thisElement}
				style={{
					"background-image": `image-set(${imageSet})`,
				}}
				{... restProps}
		>
			{myProps.children}
		</Dynamic>
	);
}


function ResponsiveBackgroundDiv(props) {
	return (
		<ResponsiveBackground tag="div" {... props} />
	);
}

function ResponsiveBackgroundMain(props) {
	return (
		<ResponsiveBackground tag="main" {... props} />
	);
}

function EducationItem(props) {
	return (
		<li>
			<b>{props.degree}</b>, {props.university}, <i>Advisor: <a href={props.advisor.url}>{props.advisor.name}</a>.</i>
		</li>
	);
}

function Education() {
	return (
		<ul class={styles.education}>
			{education.map((i) => <EducationItem {... i} />)}
		</ul>
	);
}


function PublicationItem(props) {
	return (
			<li>
				<a href={props.url}>{props.title}</a>
				<br />
				<i>{props.authors}. {props.conference}.</i>
			</li>
	);
}


function Publications() {
	return (
		<div>
			<h2>Publications</h2>
			<ul class={styles.publications}>
				{publications.map((i) => <PublicationItem {... i} />)}
			</ul>
		</div>
	);
}


function App() {
	const [contactAgree, setContactAgree] = createSignal(0);
	const toggleContact = () => setContactAgree((prev) => !prev);

	return (
		<ResponsiveBackgroundDiv src={background} class={styles.App}>
			<header class={styles.header}>
				<ResponsiveBackgroundDiv src={headerBackground} class={styles.card}>
					<div class={styles.container}>
						<h1 class={styles.title}>Richard Habeeb</h1>
					</div>
				</ResponsiveBackgroundDiv>
			</header>

			<ResponsiveBackgroundMain
					class={[styles.content, styles.container].join(" ")}
					src={contentBackground}
			>
				<div class={styles.sidebar}>
					<ResponsiveImage src={headshot} class={styles.headshot} alt="Richard Habeeb's headshot" />
					<br />
					<b><a href="https://keybase.io/richardhabeeb">Richard Habeeb</a></b> (he/him)<br/>
					<br />

					<Education />

					<ul>
						<li><a href="https://linkedin.com/in/richard-habeeb/">LinkedIn</a></li>
						<li><a href="https://x.com/0xdeadbeeb">Twitter (0xdeadbeeb)</a></li>
						<li><a href="https://github.com/richardhabeeb">GitHub</a></li>
					</ul>

					<br />
					<br />
					I may not respond to all emails, but I'm open to hear about interesting opportunities and collaborations.
					<br />
					<br />
					{ contactAgree() ?
						"richard.habeeb" + "@" + "yale.edu" :
						<button onClick={toggleContact}>I understand.</button>
					}

					<br />
					<br />

				</div>
				<section>
					<div>
						<p>
							<b>Software Architect | Low-Latency Systems Engineer | OS Security Researcher</b>
						</p>
					</div>
					<Publications />
				</section>
			</ResponsiveBackgroundMain>
		</ResponsiveBackgroundDiv>
	);
}

export default App;
