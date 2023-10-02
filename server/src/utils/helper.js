export const errorResponse = (error) => {
  const errorResponseData = {
    result: RESULT_FAIL,
    isLogger: true,
    msg: 'Server error!',
  };
  return { ...errorResponseData, ...error };
};

export function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id != userID);
}
