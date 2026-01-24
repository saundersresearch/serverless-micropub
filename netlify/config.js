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
			{ type: 'checkin', name: 'Check-in' },
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
			checkin: 'notes',
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
			return `${slug}/${yyyy}/${mm}/${dd}/${filename}`
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
	urlToFilename: (urlString, me = '', dir = '') => {
		try {
			const url = new URL(urlString)

			// Optional: only accept your own site
			const safeMe = typeof me === 'string' ? me : ''
			if (safeMe && url.origin !== safeMe.replace(/\/$/, '')) return

			// Normalize path and remove leading/trailing slashes
			const path = url.pathname.replace(/^\/|\/$/g, '')
			const parts = path.split('/')

			// Must be at least: notes|posts + yyyy + mm + dd + slug
			if (parts.length < 5) return

			const [type, yyyy, mm, dd, ...rest] = parts
			const slug = rest.join('-')

			if (type === 'notes') {
			const timestamp = slug
			return `_notes/${timestamp}.md`
			}

			if (type === 'posts') {
			return `_posts/${yyyy}-${mm}-${dd}-${slug}.md`
			}

		} catch (err) {
			console.error(err?.message || 'Invalid URL:', urlString)
		}
	}
})
