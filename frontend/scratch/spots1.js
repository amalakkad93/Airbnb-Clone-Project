export const deleteReport = (reportId) => async (dispatch) => {
  const res = await fetch(`/api/reports/${reportId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    dispatch(removeReport(reportId));
  } else {
    const errors = await res.json();
    return errors;
  }
};
