/*
 * Copyright 2018 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 * 
 * This file is part of SingleFile.
 *
 *   SingleFile is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   SingleFile is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Lesser General Public License for more details.
 *
 *   You should have received a copy of the GNU Lesser General Public License
 *   along with SingleFile.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global browser, document, Node, window, top */

this.singlefile.infobar = this.singlefile.infobar || (() => {

	const INFOBAR_TAGNAME = "singlefile-infobar";
	const LINK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QABQDuAACS38mlAAAACXBIWXMAACfuAAAn7gExzuVDAAAAB3RJTUUH4ggCDDcMnYqGGAAAATtJREFUOMvNk19LwlAYxp+zhOoqpxJ1la3patFVINk/oRDBLuyreiPFMmcj/QQRSOOwpEINDCpwRr7d1HBMc4sufO7Oe877e5/zcA4wbWLDi8urGr2+vXsOFfJZdnPboDtuueoRcQEH6RQDgNBP8bxcpfvmA0QxPHF6u/MMInLVHFDP7kMUwyjks2xU8+ZGkgGAbtSp1e5gRhBc+0KQHHSjTg2TY0tVEItF/wYqV6+pYXKoiox0atvjOuQXYnILqiJj/ztceXUlGEirGGRyC0pCciDDmfm6mlYxiFtNKAkJmb0dV2OxpFGxpNFE0NmFTtxqQpbiHsgojQX1bBuyFMfR4S7zk+PYjE5PcizI0xD+6685jubnZvH41MJwgL+p233B8tKiF7SeXMPnYIB+/8OXg2hERO44wzC1+gJYGGpVbtoqiAAAAABJRU5ErkJggg==";
	const SINGLEFILE_COMMENT = "Archive processed by SingleFile";

	if (window == top) {
		document.addEventListener("DOMContentLoaded", async () => {
			const singleFileComment = document.documentElement.childNodes[0];
			if (singleFileComment.nodeType == Node.COMMENT_NODE && singleFileComment.textContent.includes(SINGLEFILE_COMMENT)) {
				const info = singleFileComment.textContent.split("\n");
				const [, , url, saveDate] = info;
				const config = await browser.runtime.sendMessage({ getConfig: true });
				if (config.displayInfobar) {
					initInfobar(url, saveDate);
				}
			}
		});
	}
	return true;

	function initInfobar(url, saveDate) {
		let infobarElement = document.querySelector(INFOBAR_TAGNAME);
		if (!infobarElement) {
			infobarElement = document.createElement(INFOBAR_TAGNAME);
			infobarElement.style.all = "unset";
			infobarElement.style.display = "block";
			infobarElement.style.fontSize = "15px";
			infobarElement.style.color = "#9aa0a6";
			infobarElement.style.position = "fixed";
			infobarElement.style.top = "16px";
			infobarElement.style.right = "16px";
			infobarElement.style.height = "auto";
			infobarElement.style.width = "36px";
			infobarElement.style.lineHeight = "28px";
			infobarElement.style.borderRadius = "16px";
			infobarElement.style.border = "2px solid #737373";
			infobarElement.style.zIndex = 2147483647;
			infobarElement.style.textAlign = "center";
			infobarElement.style.transition = "all 250ms";
			const linkElement = document.createElement("a");
			linkElement.style.all = "unset";
			linkElement.style.display = "inline-block";
			linkElement.style.paddingLeft = "8px";
			linkElement.style.lineHeight = "28px";
			linkElement.style.cursor = "pointer";
			linkElement.target = "_blank";
			linkElement.rel = "noopener noreferrer";
			linkElement.title = "Open original page";
			linkElement.href = url.split("url: ")[1];
			const imgElement = document.createElement("img");
			imgElement.style.all == "unset";
			imgElement.style.verticalAlign = "middle";
			imgElement.style.paddingBottom = "2px";
			imgElement.src = LINK_ICON;
			linkElement.appendChild(imgElement);
			hideInfobar(infobarElement, linkElement, saveDate);
			infobarElement.onmouseover = () => infobarElement.style.opacity = 1;
			document.body.appendChild(infobarElement);
			document.addEventListener("click", event => {
				let element = event.target;
				while (element && element != infobarElement) {
					element = element.parentElement;
				}
				if (element != infobarElement) {
					hideInfobar(infobarElement, linkElement, saveDate);
				}
			});
		}
	}

	function displayInfobar(infobarElement, linkElement, saveDate) {
		infobarElement.style.opacity = 1;
		infobarElement.onmouseout = null;
		infobarElement.style.paddingLeft = infobarElement.style.paddingRight = "16px";
		infobarElement.textContent = saveDate.split("saved date: ")[1];
		infobarElement.style.width = "auto";
		infobarElement.style.backgroundColor = "#f9f9f9";
		infobarElement.style.cursor = "auto";
		infobarElement.appendChild(linkElement);
		infobarElement.onclick = null;
	}

	function hideInfobar(infobarElement, linkElement, saveDate) {
		infobarElement.style.opacity = .7;
		infobarElement.onmouseout = () => infobarElement.style.opacity = .7;
		infobarElement.style.paddingLeft = infobarElement.style.paddingRight = "0px";
		infobarElement.style.width = "28px";
		infobarElement.style.backgroundColor = "#737373";
		infobarElement.style.cursor = "pointer";
		infobarElement.textContent = "❔";
		infobarElement.onclick = event => {
			if (event.button === 0) {
				displayInfobar(infobarElement, linkElement, saveDate);
				return false;
			}
		};
	}

})();