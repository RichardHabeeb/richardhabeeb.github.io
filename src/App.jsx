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
							I am a leading computer science researcher in the <a href="https://flint.cs.yale.edu/">Flint group</a> at Yale. For my PhD I have been improving the security, safety, and performance of critical systems—focused on autonomous vehicles, drones, industrial robotics, and more. My research focuses on zero-trust architectures, secure enclaves (TEEs), and formally verifiable concurrent and asynchronous systems. My philosophy is this: No magic, no black boxes—I want to understand how everything works, so we can build amazing systems together.
						</p>
					</div>
					<div>
						<h2>Publications</h2>
						<ul class={styles.publications}>
							<li>
								<a href="https://ieeexplore.ieee.org/abstract/document/7979793">Enhanced security of building automation systems through microkernel-based controller platforms.</a>
								<br />
								<i>Xiaolong Wang, Richard Habeeb, Xinming Ou, Siddharth Amaravadi, John Hatcliff, Masaaki Mizuno, Mitchell Neilsen, S Raj Rajagopalan, Srivatsan Varadarajan. 2017 IEEE 37th International Conference on Distributed Computing Systems Workshops (ICDCSW).</i>
							</li>
						</ul>
					</div>
					<div>
						<h2>About Me</h2>
						<p>
							I have been designing, coding, hacking, and fixing computers since I was a kid working with my dad, <a href="https://www.imdb.com/name/nm0352141/">Tommy Habeeb</a>, on TV sets during my summers. In undergrad, I led the <a href="https://youtu.be/7pr81BwrDGo?t=52">K-State Robotics Competition Team (KSURCT)</a> and worked at Garmin part time for a few years learning the basics of robotics, avionics, and embedded systems design.
						</p>
						<p>
							At USF, I worked on improving the security of building automation systems (BAS) for biosafety level 3 and 4 (BSL-3, BSL-4) laboratories, which require strict temperature, pressure, fire safety, and door locking regulations and rules. During my PhD I have focused on research into safety and security of autonomous vehicles, working at Amazon's <a href="https://zoox.com/">Zoox</a>, and doing my own research on enclaves.
						</p>
					</div>
				</section>
			</ResponsiveBackgroundMain>
		</ResponsiveBackgroundDiv>
	);
}

export default App;
