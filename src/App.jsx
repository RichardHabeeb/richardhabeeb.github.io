import { splitProps, createSignal, onMount } from "solid-js"
import { Dynamic } from "solid-js/web";
import { ResponsiveImage } from '@responsive-image/solid';
import headshot from './assets/richard_habeeb.jpg?w=256;512;1024&quality=40&format=original;avif&responsive'
import headerBackground from './assets/IMG_4890.jpg?w=3984;2048;1024&quality=40&format=avif;original&responsive'
import contentBackground from './assets/64-50-5-monochrome.png?w=64&format=avif;original&responsive'
import background from './assets/nhv.jpg?w=4096;2048;1024&quality=40&format=avif;original&responsive'
import styles from './App.module.css';
import education from './education.json'

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

					I may not respond to all emails, but if you have an interesting opportuninty or idea, I would love to chat.
					<br />
					<br />
					{ contactAgree() ?
						"richard.habeeb@yale.edu" :
						<button onClick={toggleContact}>I understand.</button>
					}

				</div>
				<section>
					<div>
						<h2>Research</h2>
						<p>
							I tend spend my time building, breaking, and analyzing many kinds of systems. My research interests tend towards computer security, enclaves, operating systems, embedded physical systems like robotics, and any other highly performant and available systems. I am currently working on using <a href="https://richardhabeeb.github.io/EnclaveResearch/">enclaves or Trusted Execution Environments</a> to protect the most safety-crtical, privacy-sensitive, or real-time software on next-gen automotive systems, avionics, medical devices, robotics, and many other kinds of physical systems. <a href="https://flint.cs.yale.edu/">My research group</a> builds trustworthy systems using formal-methods, focusing on the challenges associated with concurrent and asynchronous computing.

						</p>
					</div>
					<div>
						<h2>About Me</h2>
						<p>
							I have been designing, coding, hacking, and fixing computers since I was a kid working with my dad, <a href="https://www.imdb.com/name/nm0352141/">Tommy Habeeb</a>, on TV sets during my summers. In undergrad, I led the <a href="https://youtu.be/7pr81BwrDGo?t=52">K-State Robotics Competition Team (KSURCT)</a> and worked at <a href="https://www.garmin.com/en-US/">Garmin</a>&#32; part time for a few years learning the basics of robotics, avionics, and embedded systems design.
						</p>
						<p>
							At USF, I worked on improving the <a href="https://ieeexplore.ieee.org/abstract/document/7979793">security of building automation systems</a> for biosafety level 3 and 4 (BSL-3, BSL-4) laboratories, which require strict temperature, pressure, fire safety, and door locking regulations and rules. During my PhD I have focused on research into safety and security of autonomous vehicles, working at Amazon's <a href="https://zoox.com/">Zoox</a>, anddoing my own research on enclaves.
						</p>
					</div>
				</section>
			</ResponsiveBackgroundMain>
		</ResponsiveBackgroundDiv>
	);
}

export default App;
