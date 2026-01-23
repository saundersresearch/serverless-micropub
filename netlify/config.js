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
			{ uid: 'bridgy_fed', name: 'Bridgy Fed', checked: true },
			{ uid: 'mastodon', name: 'Mastodon via Bridgy', checked: true },
			{ uid: 'bluesky', name: 'Bluesky via Bridgy', checked: true },
		],
		'post-types': [
			{ type: 'note', name: 'Note' },
			{ type: 'photo', name: 'Photo' },
			{ type: 'reply', name: 'Reply' },
			{ type: 'bookmark', name: 'Bookmark' },
			{ type: 'like', name: 'Like' },
			{ type: 'article', name: 'Article' },
			{ type: 'rsvp', name: 'RSVP' },
			{ type: 'repost', name: 'Repost' },
			{ type: 'watch', name: 'Watch' },
			{ type: 'read', name: 'Read' },
			{ type: 'listen', name: 'Listen' },
			{ type: 'game', name: 'Game' },
		],
	},
	formatSlug: (type, filename) => {
		const typeToSlug = {
			note: 'notes',
			photo: 'notes',
			reply: 'notes',
			bookmark: 'notes',
			like: 'notes',
			article: 'posts',
			rsvp: 'notes',
			repost: 'notes',
			watch: 'notes',
			read: 'notes',
			listen: 'notes',
			game: 'notes',
		}
		const slug = typeToSlug[type]

		const now = new Date()
		const yyyy = now.getUTCFullYear()
		const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
		const dd = String(now.getUTCDate()).padStart(2, '0')

		const ts = Math.round(now / 1000)

		console.log(filename);
		if (slug === 'notes') {
			return `${slug}/${yyyy}/${mm}/${dd}/${filename}`
		}
		if (slug === 'posts') {
			return `${slug}/${filename}`
		}
		return `${filename}`
		},
	formatFilename: (dir = 'src', slug) => {
	const filename = slug.split('/').pop().replace(/\.md$/, '')

	// If slug contains "posts", switch dir to "_posts"
	const outputDir = slug.match(/(^|\/)posts(\/|$)/) ? '_posts' : dir

	// If slug contains "posts", add YYYY-MM-DD- prefix
	if (outputDir === '_posts') {
		const now = new Date()
		const yyyy = now.getUTCFullYear()
		const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
		const dd = String(now.getUTCDate()).padStart(2, '0')
		return `${outputDir.replace(/\/$/, '')}/${yyyy}-${mm}-${dd}-${filename}.md`
	} else {
		return `${outputDir.replace(/\/$/, '')}/${filename}.md`
	}
},
})
