import Fetch from "@11ty/eleventy-fetch";

const getTournamentsQuery = `
query TournamentsByState($perPage: Int, $state: String!, $countryCode: String!) {
  tournaments(
    query: {perPage: $perPage, filter: {addrState: $state, upcoming: true, countryCode: $countryCode}}
  ) {
    nodes {
      id
      name
      venueAddress
      startAt
      url(relative: false)
    }
  }
}
`;

async function getTournaments() {
	const url = process.env.START_GG_API_URL;

	if (!url || !process.env.START_GG_API_KEY) {
		throw new Error("Start.gg env variables not set");
	}

	const fetchOptions = {
		method: "POST",
		body: JSON.stringify({
			query: getTournamentsQuery,
			variables: { perPage: 10, state: "AR", countryCode: "US" },
			operationName: "TournamentsByState",
		}),
		headers: {
			Authorization: `Bearer ${process.env.START_GG_API_KEY}`,
		},
	};

	const tournamentsResponse = await Fetch(url, {
		type: "json",
		duration: "1d",
		fetchOptions,
	});

	return tournamentsResponse.data.tournaments.nodes.map(
		({ startAt, ...rest }) => ({
			...rest,
			startAt: new Date(startAt * 1000).toLocaleDateString("en-US"),
		}),
	);
}

export default getTournaments;
