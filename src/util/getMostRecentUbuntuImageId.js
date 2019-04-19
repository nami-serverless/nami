const { asyncDescribeImages } = require('../aws/awsFunctions.js');

const dateSorting = (imageA, imageB) => {
  const dateA = new Date(imageA.CreationDate);
  const dateB = new Date(imageB.CreationDate);

  return dateB - dateA;
};

const sortImagesByDate = array => array.sort(dateSorting);

module.exports = async function getMostRecentUbuntuImageId() {
  const describeImagesParams = {
    Filters: [
      {
        Name: 'name',
        Values: ['ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-*'],
      },
      {
        Name: 'owner-id',
        Values: ['099720109477'],
      },
      {
        Name: 'is-public',
        Values: ['true'],
      },
      {
        Name: 'root-device-type',
        Values: ['ebs'],
      },
      {
        Name: 'state',
        Values: ['available'],
      },
    ],
  };

  const results = await asyncDescribeImages(describeImagesParams);
  const images = results.Images;

  return sortImagesByDate(images)[0].ImageId;
};
