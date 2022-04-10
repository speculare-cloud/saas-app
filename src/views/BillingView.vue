<template>
	<div class="flex-1">
		<div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8 sm:h-11">
			<h3 class="text-2xl">
				Pick a plan
			</h3>
		</div>
		<div class="flex flex-col lg:flex-row mb-2 gap-4">
			<div class="flex-1 card bg-neutral shadow-xl">
				<div class="card-body">
					<h2 class="card-title">
						Free
					</h2>
					<div class="stat-value font-semibold">
						$0<small class="text-sm ml-1">/mo</small>
					</div>
					<div class="divider mb-0" />
					<ul class="list-unstyled text-sm">
						<li>2 monitored servers</li>
						<li>5s of granularity</li>
						<li>7 days metrics retention</li>
						<li>Non priority support</li>
					</ul>
					<div class="flex-1 items-end card-actions w-full">
						<button class="btn btn-primary w-full relative">
							Select
							<svg
								class="h-6 w-6 fill-current absolute right-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
								viewBox="0 0 24 24">
								<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
							</svg>
						</button>
					</div>
				</div>
			</div>
			<div class="flex-1 card bg-neutral shadow-xl">
				<div class="card-body">
					<h2 class="card-title">
						Freelancer
					</h2>
					<div class="stat-value font-semibold">
						$3<small class="text-sm ml-1">/mo</small>
					</div>
					<div class="divider mb-0" />
					<ul class="list-unstyled text-sm">
						<li class="highlighted">
							Everything in Free
						</li>
						<li>+$1 per server up to 10+2 maximum</li>
						<li>1s of granularity</li>
						<li>1 month metrics retention</li>
						<li>+$5/mo for daily backups</li>
						<li>Priority support</li>
					</ul>
					<div class="flex-1 items-end card-actions w-full">
						<button class="btn btn-primary w-full relative">
							Select
							<svg
								class="h-6 w-6 fill-current absolute right-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
								viewBox="0 0 24 24">
								<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
							</svg>
						</button>
					</div>
				</div>
			</div>
			<div class="flex-1 card bg-neutral shadow-xl">
				<div class="card-body">
					<h2 class="card-title">
						Business
					</h2>
					<div class="stat-value font-semibold">
						$5<small class="text-sm ml-1">/mo</small>
					</div>
					<div class="divider mb-0" />
					<ul class="list-unstyled text-sm">
						<li class="highlighted">
							Everything in Freelancer
						</li>
						<li>+$3 per server</li>
						<li>as low as 100ms of granularity (default 1s)</li>
						<li>1 year metrics retention</li>
						<li>+$5/mo for daily backup</li>
						<li>Business support</li>
					</ul>
					<div class="flex-1 items-end card-actions w-full">
						<button class="btn btn-primary w-full relative">
							Select
							<svg
								class="h-6 w-6 fill-current absolute right-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
								viewBox="0 0 24 24">
								<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="card bg-neutral shadow-xl mt-4">
			<div class="card-body flex-row justify-between items-center">
				<div class="flex-1">
					<h2 class="card-title">
						Enterprise-ready. <span class="hidden lg:block font-normal">Reach out for a custom quote.</span>
					</h2>
					<p class="mt-2 text-sm">
						Planning to monitor more than 100 servers or to collect metrics every few ms? <br><span class="hidden lg:contents">Let's speak about it to setup your monitoring solution.</span>
					</p>
					<p class="lg:hidden mt-2 text-sm">
						Check our <a class="cursor-pointer text-info">features comparison</a> or <a class="cursor-pointer text-info">book a demo</a>.
					</p>
				</div>
				<button class="hidden lg:flex btn btn-primary justify-between">
					Book a demo
					<svg
						class="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
						viewBox="0 0 24 24">
						<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
					</svg>
				</button>
			</div>
		</div>
		<div class="card bg-neutral shadow-xl mt-4">
			<div class="card-body">
				<h2 class="card-title">
					Costs calculator
				</h2>
				<p class="text-sm">
					It's not clear how much it's gonna cost you based on the above table?
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Billing',
}
</script>