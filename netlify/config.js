import Micropub from '@benjifs/micropub'
import GitHubStore from '@benjifs/github-store'

const {
	ME,
	TOKEN_ENDPOINT,
	GITHUB_TOKEN,
	GITHUB_USER,
	GITHUB_REPO,
} = process.env

const store = new GitHubStore({
	token: GITHUB_TOKEN,
	user: GITHUB_USER,
	repo: GITHUB_REPO,
})

export const micropub = new Micropub({
	store,
	me: ME,
	tokenEndpoint: TOKEN_ENDPOINT,
	contentDir: '_notes',
	mediaDir: 'assets/images/notes',
	// https://micropub.spec.indieweb.org/#configuration
	config: {
		'media-endpoint': 'https://micropub-adamsaunders.netlify.app/media',
		'syndicate-to': [
			{ uid: 'https://fed.brid.gy/', name: 'Bridgy Fed', checked: true },
			{ uid: 'https://brid.gy/publish/mastodon', name: 'Mastodon via Bridgy', checked: true },
			{ uid: 'https://brid.gy/publish/bluesky', name: 'Bluesky via Bridgy', checked: true },
		],
		// 'post-types': [
		// 	{ type: 'note', name: 'Note' },
		// 	{ type: 'photo', name: 'Photo' },
		// 	{ type: 'reply', name: 'Reply' },
		// 	{ type: 'bookmark', name: 'Bookmark' },
		// 	{ type: 'like', name: 'Like' },
		// 	{ type: 'article', name: 'Article' },
		// 	{ type: 'rsvp', name: 'RSVP' },
		// 	{ type: 'repost', name: 'Repost' },
		// 	{ type: 'watch', name: 'Watch' },
		// 	{ type: 'read', name: 'Read' },
		// 	{ type: 'listen', name: 'Listen' },
		// 	{ type: 'game', name: 'Game' },
		// ],
	},
	// formatSlug: (type, filename) => {
	// 	const typeToSlug = {
	// 		like: 'likes',
	// 		bookmark: 'bookmarks',
	// 		rsvp: 'rsvp',
	// 		article: 'articles',
	// 		watch: 'watched',
	// 		read: 'read',
	// 		listen: 'listen',
	// 		play: 'play'
	// 	}
	// 	return `${typeToSlug[type] || 'notes'}/${filename}`
	// },
})
