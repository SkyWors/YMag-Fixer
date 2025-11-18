const navigationData = window.performance.getEntries().find(e => e.entryType === "navigation");

// Redirect to homepage if 404
if (navigationData.responseStatus === 404) {
	window.location.href = window.origin;
}

if (window.origin.match("^https://[a-zA-Z0-9_-]+\.ymag\.cloud$")) {
	// Inject custom CSS
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = chrome.runtime.getURL("inject/style.css");
	document.head.appendChild(link);

	// Inject Remixicon CSS
	var remix = document.createElement("link");
	remix.rel = "stylesheet";
	remix.href = chrome.runtime.getURL("inject/remix.css");
	document.head.appendChild(remix);

	// Modify profile element
	let profilElement = document.querySelector(".user-info-label");
	profilElement.removeChild(profilElement.lastChild);
	profilElement.removeChild(profilElement.lastChild);
	profilElement.setAttribute("style", "line-height: 44px");

	// Fix calendar colors
	const newColor = '#f5cb42';

	/*
	 * Convert RGB to HEX
	 *
	 * @param {string} rgb - The RGB color string (e.g., "rgb(255, 125, 125)").
	 *
	 * @returns {string} - The HEX color string (e.g., "#FF7D7D").
	 */
	function convertRgbToHex(rgb) {
		const result = rgb.match(/\d+/g);

		if (!result)
			return null;

		return (
			'#' +
			result
			.slice(0, 3)
			.map(x => {
				const hex = parseInt(x).toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			})
			.join('')
			.toUpperCase()
		);
	}

	/*
	 * Update element colors from RGB to HEX
	 */
	function updateElementColors() {
		const allElements = document.querySelectorAll('*');
		allElements.forEach(el => {
			const styles = window.getComputedStyle(el);

			['background-color'].forEach(prop => {
			const value = styles.getPropertyValue(prop);
			const hexValue = convertRgbToHex(value.trim());

			if (
				value.trim() === 'rgb(255, 125, 125)' ||
				hexValue === '#FF7D7D'
			) {
				el.style.setProperty(prop, newColor, 'important');
			}
			});
		});
	}

	/*
	 * Add an icon to the navbar
	 *
	 * @param {string} iconName - The class name of the icon (e.g., "ri-folder-2-line").
	 * @param {string} href - The URL to link to.
	 * @param {string} title - The title attribute for the link.
	 */
	function addNavbarIcon(iconName, href, title) {
		const nav = document.querySelector("body > header > nav");
		if (!nav) return;

		// Create divider
		const divider = document.createElement("div");
		divider.className = "page-header-divider";

		// Create nav item
		const navItem = document.createElement("div");
		navItem.className = "primary-nav-item";

		const link = document.createElement("a");
		link.href = href;
		if (title) link.title = title;
		link.className = "dropdown-menu-toggle ";

		const icon = document.createElement("i");
		icon.className = iconName;

		link.appendChild(icon);
		navItem.appendChild(link);

		// Find the third child (index 2)
		const thirdChild = nav.children[2];

		// Insert before the third child
		nav.insertBefore(divider, thirdChild);
		nav.insertBefore(navItem, thirdChild);
	}

	// Add dropdown icons
	document.querySelectorAll(".dropdown-menu-toggle").forEach(dropDownButton => {
		if (dropDownButton.className == "dropdown-menu-toggle " && dropDownButton.href == "javascript:void(0)") {
			const dropIcon = document.createElement("i");
			dropIcon.className = "ri-arrow-drop-down-line";
			dropIcon.style.fontSize = "22px";
			dropIcon.style.verticalAlign = "middle";
			dropDownButton.appendChild(dropIcon);
		}
	});

	// Replace bell icons
	function replaceIcons(oldIcon, newIcon, size, color = null) {
		document.querySelectorAll(oldIcon).forEach(bellIcon => {
			bellIcon.className = newIcon;
			bellIcon.style.fontSize = size + "px";
			bellIcon.style.verticalAlign = "middle";
			if (color) {
				bellIcon.style.color = color;
			}
		});
	}

	replaceIcons("span.fas.fa-home-lg", "ri-home-2-line", 24);
	replaceIcons("span.fas.fa-bell.fa-xs.text-white", "ri-notification-3-line", 20);
	replaceIcons("span.fas.fa-expand-arrows-alt.picto-gray", "ri-fullscreen-line picto-gray", 18, "#404040");
	replaceIcons("span.user-info-arrow-down", "ri-arrow-drop-down-line", 22, "#ffffff");

	updateElementColors();

	// Add custom icons to the navbar
	addNavbarIcon("ri-folder-2-line", "/index.php/apprenant/documents/", "Documents");
	addNavbarIcon("ri-pie-chart-line", "/index.php/apprenant/bulletin/", "Bulletins");
	addNavbarIcon("ri-calendar-2-line", "/index.php/apprenant/planning/courant/", "Planning");
}
