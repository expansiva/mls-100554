/// <mls shortName="widgetEmbedsSocialMedia" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { propertyDataSource, propertyCompositeDataSource } from '/_100554_/l2/collabDecorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
@customElement('widget-embeds-social-media-100554')
export class WcEmbedsSocialMedia100554 extends StateLitElement {

    @propertyDataSource({ type: String }) datasource: string | undefined;
    @property({ type: String }) description: string | undefined;
    @property({ type: String }) url: string | undefined;

    render() {

        this.style.display = 'block'
        if (!this.url) return html`<h3>Not found url</h3>`

        if (this.url.includes("youtube.com") || this.url.includes("youtu.be"))
            return this.generateYouTubeEmbed(this.url);

        if (this.url.includes("twitter.com") || this.url.includes("x.com"))
            return this.generateTwitterEmbed(this.url);

        return html`<h3> Not found url </h3>`

    }

    generateYouTubeEmbed(url: string) {

        let videoId: string | undefined | null = '';

        if (url.includes("youtu.be")) {
            videoId = url.split('/').pop();
        } else {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get('v');
        }
        return html`<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen style="display: flex; justify-content: center; align-items: center; margin: 0 auto;"></iframe>`;
    }

    generateTwitterEmbed(url: string) {
        this.loadExternalScripts()
        return html`
            <iframe style='width:100%;border:none' onload="setTimeout(()=>{this.style.height = (this.contentWindow.document.body.scrollHeight + 50) +'px'},1500)" srcdoc=' <html> <head> <title></title> </head> <body style=" display: flex; align-items: center; justify-content: center;"> <blockquote class="twitter-tweet"> <a href="${url.replace('x.com', 'twitter.com')}"></a> </blockquote> <script src="https://platform.twitter.com/widgets.js" ></script> </body> </html>'> 
            </iframe>
        `;

    }


    loadExternalScripts() {
        // Carrega o script do Twitter

        const twitterScript = document.createElement('script');
        twitterScript.src = "https://platform.twitter.com/widgets.js";
        twitterScript.async = true;
        twitterScript.charset = "utf-8";
        document.body.appendChild(twitterScript);

    }

}