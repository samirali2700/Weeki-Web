<script>
	import { fade, slide, fly, scale } from 'svelte/transition';
	import { weekNumber } from 'weeknumber';
	import { getDay, getMonth } from '../utils/date';
	import MdAddBox from 'svelte-icons/md/MdAddBox.svelte';
	import MdSend from 'svelte-icons/md/MdSend.svelte';
	import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';

	import { onMount } from 'svelte';
	import { apiGet, apiPost, apiDelete } from '../utils/fetches';
	import { POST_POST, GET_POSTS, DELETE_POST } from '../utils/endpoints';
	import { notifyError } from '../utils/notify';
	import { user } from '../Stores/user';

	const week = weekNumber(new Date());
	const month = getMonth(new Date().getMonth());
	const day = getDay(new Date().getDay());

	let newPost = false;
	let postContent = '';
	$: postLength = postContent.length;
	let postTitle = '';
	const posts = [];

	onMount(async () => {
		await fetchPosts();
	});

	async function fetchPosts() {
		const { payload } = await apiGet(GET_POSTS());
		if (payload) {
			const nonSortedPosts = payload.posts;
			const sortedPosts = nonSortedPosts.sort(function (a, b) {
				return b.createdAt - a.createdAt;
			});
			posts = sortedPosts;
		}
	}

	async function post() {
		const { error, payload } = await apiPost(POST_POST(), {
			title: postTitle,
			content: postContent,
		});
		if (payload) {
			postTitle = '';
			postContent = '';
			newPost = false;
			await fetchPosts();
		} else {
			notifyError(error.message);
		}
	}
	async function deletePost(postId) {
		const { error, payload } = await apiDelete(DELETE_POST(postId));
		if (payload) {
			if (posts.length <= 1) {
				posts = [];
			} else await fetchPosts();
		} else notifyError(error.message);
	}
</script>

<div class="header flex-align" in:slide>
	<h1>Hjem</h1>
</div>
<div class=" container">
	<div class="flex-align">
		<h1>Uge {week}</h1>
		<h3 class="undertitle">
			{day}
			{new Date().getDate()}. {month}
			{new Date().getFullYear()}
		</h3>
	</div>
	<div class="divider" />
</div>

<div class="content-container flex-container ">
	<div class="center-container container">
		<p>Du har ingen vagter i dag</p>
	</div>
	<div class="center-container container ">
		<h1>Vagter</h1>
	</div>
	<div class="container">
		<div class="grid-container">
			<div class="grid-full-column">
				<div class="flex-align">
					<p class="undertitle">Opslag</p>
					{#if newPost}
						<div class="flex-align" style:width="25%">
							<button
								style:width="50%"
								class="button"
								on:click={() => (newPost = !newPost)}>Fortryd</button
							>

							<div
								class:disabled={postContent.length < 10}
								class="flex-align icon"
								on:click={post}
							>
								Slå op
								<div class="icon-small ">
									<MdSend />
								</div>
							</div>
						</div>
					{:else}
						<div class="flex-align icon" on:click={() => (newPost = !newPost)}>
							<div class="icon-small ">
								<MdAddBox />
							</div>
							Nyt Opslag
						</div>
					{/if}
				</div>
				<div class="divider" />
			</div>
			{#if newPost}
				<div>
					Tegn:{postLength}
				</div>
				<div class="grid-full-column">
					<input bind:value={postTitle} placeholder="Title" class="flex-align" />
					<div class="divider" />
					<div class="flex-align">
						<textarea
							bind:value={postContent}
							class=" newPost"
							placeholder="Du ska have mindst 10 tegn for at oprette et opslag"
						/>
					</div>
				</div>
			{/if}
			{#if posts.length > 0}
				{#each posts as post (post._id)}
					<div class="grid-container grid-full-column post">
						<div class="grid-full-column flex-align">
							<div>
								<b class="info-text">{post.name}</b>
								<small>
									{new Date(post.createdAt).toLocaleDateString()}
									{new Date(post.createdAt).toLocaleTimeString()}
								</small>
							</div>
							<div>
								{#if $user._id === post.createdBy}
									<div
										class="delete icon-medium delete-icon"
										on:click={() => deletePost(post._id)}
									>
										<IoIosClose />
									</div>
								{/if}
							</div>
						</div>

						<h4 class="grid-full-column">{post.title}</h4>
						<q class="grid-full-column">
							{post.content}
						</q>
						<hr class="grid-full-column" />
					</div>
				{/each}
			{:else}
				<h3>Kom i gang med det første opslag</h3>
			{/if}
		</div>
	</div>
</div>

<style>
	.container {
		padding: 26px;
	}
	.newPost {
		width: 100%;
		resize: vertical;
		max-height: 450px;
	}
	textarea:focus {
		outline: none;
		border: 1px solid var(--secondary-color);
	}
	.disabled {
		color: #cecece;
		pointer-events: none;
	}
	.delete {
		opacity: 0%;
	}
	.delete:hover {
		opacity: 100%;
	}
	.post:hover .delete {
		opacity: 20%;
	}
	.post:hover .delete:hover {
		opacity: 100%;
	}
</style>
