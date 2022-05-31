<template>
	<section>
		<div class="md:flex justify-between">
			<div class="prose-sm flex justify-between items-center">
				<h1>
					Incidents
				</h1>
			</div>
			<div class="mt-4 md:mt-0 flex flex-col items-start sm:flex-row sm:space-x-4">
				<div class="mb-3 relative self-stretch sm:mb-0 sm:self-end w-[265px]">
					<svg class="absolute left-[12px] top-[13px]" height="14" viewBox="0 0 14 14" width="14">
						<path
							stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"
							d="M13 13L9.61539 9.61539M11.0513 6.02564C11.0513 6.68562 10.9213 7.33913 10.6687 7.94887C10.4162 8.55861 10.046 9.11263 9.57931 9.57931C9.11263 10.046 8.55861 10.4162 7.94887 10.6687C7.33913 10.9213 6.68562 11.0513 6.02564 11.0513C5.36566 11.0513 4.71215 10.9213 4.10241 10.6687C3.49267 10.4162 2.93865 10.046 2.47198 9.57931C2.0053 9.11263 1.63512 8.55861 1.38255 7.94887C1.12999 7.33913 1 6.68562 1 6.02564C1 4.69276 1.52949 3.41447 2.47198 2.47198C3.41447 1.52949 4.69276 1 6.02564 1C7.35852 1 8.63682 1.52949 9.57931 2.47198C10.5218 3.41447 11.0513 4.69276 11.0513 6.02564Z" />
					</svg>

					<input
						type="text" name="q" id="q" class="form-control-search font-medium !pl-[34px] h-10 text-neutral-500"
						placeholder="Search incidents" autocomplete="off">
				</div>
			</div>
		</div>
		<div class="mt-12">
			<div class="overflow-x-auto no-scrollbar rounded-lg shadow">
				<table class="table w-full">
					<thead>
						<tr>
							<th>Monitor</th>
							<th>Started at</th>
							<th>Length</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="flex flex-row items-center gap-4">
								<svg
									xmlns="http://www.w3.org/2000/svg" width="47" height="46" viewBox="0 0 47 46"
									fill="none" class="inline w-8 h-8 rounded">
									<rect
										x="0.125" width="46" height="46" rx="8"
										fill="#3B4254" />
									<path
										fill="#ff000000" d="M21.6875 19.7656V21.9218M21.6875 26.2343H21.6983M30.9788 16.514C27.5699 16.695 24.2284 15.5163 21.6875 13.2365C19.1466 15.5163 15.8051 16.695 12.3962 16.514C12.1219 17.576 11.9835 18.6686 11.9844 19.7656C11.9844 25.7934 16.1071 30.8595 21.6875 32.2955C27.2679 30.8595 31.3906 25.7944 31.3906 19.7656C31.3906 18.6422 31.2472 17.5533 30.9788 16.514Z" stroke="#B8BFD1" stroke-width="2.5875"
										stroke-linecap="round" stroke-linejoin="round" />
									<circle cx="31.75" cy="29.9904" r="8.625" fill="#3B4254" />
									<path fill-rule="evenodd" clip-rule="evenodd" d="M31.85 36.8904C33.6799 36.8904 35.435 36.1634 36.729 34.8694C38.023 33.5754 38.75 31.8204 38.75 29.9904C38.75 28.1604 38.023 26.4054 36.729 25.1114C35.435 23.8174 33.6799 23.0904 31.85 23.0904C30.02 23.0904 28.2649 23.8174 26.9709 25.1114C25.6769 26.4054 24.95 28.1604 24.95 29.9904C24.95 31.8204 25.6769 33.5754 26.9709 34.8694C28.2649 36.1634 30.02 36.8904 31.85 36.8904V36.8904ZM35.0472 28.8752C35.2044 28.7125 35.2913 28.4946 35.2893 28.2685C35.2874 28.0424 35.1966 27.826 35.0367 27.6661C34.8768 27.5062 34.6605 27.4155 34.4343 27.4135C34.2082 27.4116 33.9903 27.4985 33.8277 27.6556L30.9875 30.4958L29.8722 29.3806C29.7096 29.2235 29.4917 29.1366 29.2656 29.1385C29.0394 29.1405 28.8231 29.2312 28.6632 29.3911C28.5033 29.551 28.4125 29.7674 28.4106 29.9935C28.4086 30.2196 28.4956 30.4375 28.6527 30.6002L30.3777 32.3252C30.5394 32.4869 30.7587 32.5777 30.9875 32.5777C31.2162 32.5777 31.4355 32.4869 31.5972 32.3252L35.0472 28.8752V28.8752Z" fill="#10C97A" />
								</svg>
								<div class="flex flex-col text-sm">
									speculare-server
									<span class="text-slate-400">little description of the issue</span>
								</div>
							</td>
							<td class="text-sm text-slate-400">
								22 May at 08:09pm CEST
							</td>
							<td class="text-sm text-slate-400">
								5 minutes
							</td>
						</tr>
						<tr>
							<td class="flex flex-row items-center gap-4">
								<svg
									xmlns="http://www.w3.org/2000/svg" width="47" height="46" viewBox="0 0 47 46"
									fill="none" class="inline w-8 h-8 rounded">
									<rect
										x="0.125" width="46" height="46" rx="8"
										fill="#3B4254" />
									<path
										fill="#ff000000" d="M21.6875 19.7656V21.9218M21.6875 26.2343H21.6983M30.9788 16.514C27.5699 16.695 24.2284 15.5163 21.6875 13.2365C19.1466 15.5163 15.8051 16.695 12.3962 16.514C12.1219 17.576 11.9835 18.6686 11.9844 19.7656C11.9844 25.7934 16.1071 30.8595 21.6875 32.2955C27.2679 30.8595 31.3906 25.7944 31.3906 19.7656C31.3906 18.6422 31.2472 17.5533 30.9788 16.514Z" stroke="#B8BFD1" stroke-width="2.5875"
										stroke-linecap="round" stroke-linejoin="round" />
									<circle cx="31.75" cy="29.9904" r="8.625" fill="#3B4254" />
									<path fill-rule="evenodd" clip-rule="evenodd" d="M31.85 36.8904C33.6799 36.8904 35.435 36.1634 36.729 34.8694C38.023 33.5754 38.75 31.8204 38.75 29.9904C38.75 28.1604 38.023 26.4054 36.729 25.1114C35.435 23.8174 33.6799 23.0904 31.85 23.0904C30.02 23.0904 28.2649 23.8174 26.9709 25.1114C25.6769 26.4054 24.95 28.1604 24.95 29.9904C24.95 31.8204 25.6769 33.5754 26.9709 34.8694C28.2649 36.1634 30.02 36.8904 31.85 36.8904V36.8904ZM35.0472 28.8752C35.2044 28.7125 35.2913 28.4946 35.2893 28.2685C35.2874 28.0424 35.1966 27.826 35.0367 27.6661C34.8768 27.5062 34.6605 27.4155 34.4343 27.4135C34.2082 27.4116 33.9903 27.4985 33.8277 27.6556L30.9875 30.4958L29.8722 29.3806C29.7096 29.2235 29.4917 29.1366 29.2656 29.1385C29.0394 29.1405 28.8231 29.2312 28.6632 29.3911C28.5033 29.551 28.4125 29.7674 28.4106 29.9935C28.4086 30.2196 28.4956 30.4375 28.6527 30.6002L30.3777 32.3252C30.5394 32.4869 30.7587 32.5777 30.9875 32.5777C31.2162 32.5777 31.4355 32.4869 31.5972 32.3252L35.0472 28.8752V28.8752Z" fill="#10C97A" />
								</svg>
								<div class="flex flex-col text-sm">
									wireguard-ng
									<span class="text-slate-400">little description of the issue</span>
								</div>
							</td>
							<td class="text-sm text-slate-400">
								22 May at 08:09pm CEST
							</td>
							<td class="text-sm text-slate-400">
								5 minutes
							</td>
						</tr>
						<tr>
							<td class="flex flex-row items-center gap-4">
								<svg
									xmlns="http://www.w3.org/2000/svg" width="47" height="46" viewBox="0 0 47 46"
									fill="none" class="inline w-8 h-8 rounded">
									<rect
										x="0.125" width="46" height="46" rx="8"
										fill="#3B4254" />
									<path
										fill="#ff000000" d="M21.6875 19.7656V21.9218M21.6875 26.2343H21.6983M30.9788 16.514C27.5699 16.695 24.2284 15.5163 21.6875 13.2365C19.1466 15.5163 15.8051 16.695 12.3962 16.514C12.1219 17.576 11.9835 18.6686 11.9844 19.7656C11.9844 25.7934 16.1071 30.8595 21.6875 32.2955C27.2679 30.8595 31.3906 25.7944 31.3906 19.7656C31.3906 18.6422 31.2472 17.5533 30.9788 16.514Z" stroke="#B8BFD1" stroke-width="2.5875"
										stroke-linecap="round" stroke-linejoin="round" />
									<circle cx="31.75" cy="29.9904" r="8.625" fill="#3B4254" />
									<path fill-rule="evenodd" clip-rule="evenodd" d="M31.85 36.8904C33.6799 36.8904 35.435 36.1634 36.729 34.8694C38.023 33.5754 38.75 31.8204 38.75 29.9904C38.75 28.1604 38.023 26.4054 36.729 25.1114C35.435 23.8174 33.6799 23.0904 31.85 23.0904C30.02 23.0904 28.2649 23.8174 26.9709 25.1114C25.6769 26.4054 24.95 28.1604 24.95 29.9904C24.95 31.8204 25.6769 33.5754 26.9709 34.8694C28.2649 36.1634 30.02 36.8904 31.85 36.8904V36.8904ZM35.0472 28.8752C35.2044 28.7125 35.2913 28.4946 35.2893 28.2685C35.2874 28.0424 35.1966 27.826 35.0367 27.6661C34.8768 27.5062 34.6605 27.4155 34.4343 27.4135C34.2082 27.4116 33.9903 27.4985 33.8277 27.6556L30.9875 30.4958L29.8722 29.3806C29.7096 29.2235 29.4917 29.1366 29.2656 29.1385C29.0394 29.1405 28.8231 29.2312 28.6632 29.3911C28.5033 29.551 28.4125 29.7674 28.4106 29.9935C28.4086 30.2196 28.4956 30.4375 28.6527 30.6002L30.3777 32.3252C30.5394 32.4869 30.7587 32.5777 30.9875 32.5777C31.2162 32.5777 31.4355 32.4869 31.5972 32.3252L35.0472 28.8752V28.8752Z" fill="#10C97A" />
								</svg>
								<div class="flex flex-col text-sm">
									rtin
									<span class="text-slate-400">little description of the issue</span>
								</div>
							</td>
							<td class="text-sm text-slate-400">
								22 May at 08:09pm CEST
							</td>
							<td class="text-sm text-slate-400">
								5 minutes
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="mt-8 flex justify-center">
				<div class="btn-group">
					<button class="btn btn-active">
						1
					</button>
					<button class="btn">
						2
					</button>
					<button class="btn">
						3
					</button>
					<button class="btn">
						4
					</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	name: 'Incidents',

	data () {
		return {}
	},

	mounted: function () {},
}
</script>