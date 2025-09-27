// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'match_model.dart';

// **************************************************************************
// IsarCollectionGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, unnecessary_parenthesis, unnecessary_raw_strings, unnecessary_null_checks, join_return_with_assignment, prefer_final_locals, avoid_js_rounded_ints, avoid_positional_boolean_parameters, always_specify_types

extension GetMatchCollection on Isar {
  IsarCollection<Match> get matchs => this.collection();
}

const MatchSchema = CollectionSchema(
  name: r'Match',
  id: -4384922031457139852,
  properties: {
    r'athleteName': PropertySchema(
      id: 0,
      name: r'athleteName',
      type: IsarType.string,
    ),
    r'dateMatched': PropertySchema(
      id: 1,
      name: r'dateMatched',
      type: IsarType.dateTime,
    ),
    r'matchReason': PropertySchema(
      id: 2,
      name: r'matchReason',
      type: IsarType.string,
    ),
    r'sponsorName': PropertySchema(
      id: 3,
      name: r'sponsorName',
      type: IsarType.string,
    )
  },
  estimateSize: _matchEstimateSize,
  serialize: _matchSerialize,
  deserialize: _matchDeserialize,
  deserializeProp: _matchDeserializeProp,
  idName: r'id',
  indexes: {},
  links: {},
  embeddedSchemas: {},
  getId: _matchGetId,
  getLinks: _matchGetLinks,
  attach: _matchAttach,
  version: '3.1.0+1',
);

int _matchEstimateSize(
  Match object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  bytesCount += 3 + object.athleteName.length * 3;
  bytesCount += 3 + object.matchReason.length * 3;
  bytesCount += 3 + object.sponsorName.length * 3;
  return bytesCount;
}

void _matchSerialize(
  Match object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeString(offsets[0], object.athleteName);
  writer.writeDateTime(offsets[1], object.dateMatched);
  writer.writeString(offsets[2], object.matchReason);
  writer.writeString(offsets[3], object.sponsorName);
}

Match _matchDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = Match();
  object.athleteName = reader.readString(offsets[0]);
  object.dateMatched = reader.readDateTime(offsets[1]);
  object.id = id;
  object.matchReason = reader.readString(offsets[2]);
  object.sponsorName = reader.readString(offsets[3]);
  return object;
}

P _matchDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readString(offset)) as P;
    case 1:
      return (reader.readDateTime(offset)) as P;
    case 2:
      return (reader.readString(offset)) as P;
    case 3:
      return (reader.readString(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

Id _matchGetId(Match object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _matchGetLinks(Match object) {
  return [];
}

void _matchAttach(IsarCollection<dynamic> col, Id id, Match object) {
  object.id = id;
}

extension MatchQueryWhereSort on QueryBuilder<Match, Match, QWhere> {
  QueryBuilder<Match, Match, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension MatchQueryWhere on QueryBuilder<Match, Match, QWhereClause> {
  QueryBuilder<Match, Match, QAfterWhereClause> idEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: id,
        upper: id,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterWhereClause> idNotEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            )
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            );
      } else {
        return query
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            )
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            );
      }
    });
  }

  QueryBuilder<Match, Match, QAfterWhereClause> idGreaterThan(Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.greaterThan(lower: id, includeLower: include),
      );
    });
  }

  QueryBuilder<Match, Match, QAfterWhereClause> idLessThan(Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.lessThan(upper: id, includeUpper: include),
      );
    });
  }

  QueryBuilder<Match, Match, QAfterWhereClause> idBetween(
    Id lowerId,
    Id upperId, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: lowerId,
        includeLower: includeLower,
        upper: upperId,
        includeUpper: includeUpper,
      ));
    });
  }
}

extension MatchQueryFilter on QueryBuilder<Match, Match, QFilterCondition> {
  QueryBuilder<Match, Match, QAfterFilterCondition> athleteNameEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'athleteName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> athleteNameGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'athleteName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> athleteNameLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'athleteName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> athleteNameBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'athleteName',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> athleteNameStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'athleteName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> athleteNameEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'athleteName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> athleteNameContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'athleteName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> athleteNameMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'athleteName',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> athleteNameIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'athleteName',
        value: '',
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> athleteNameIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'athleteName',
        value: '',
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> dateMatchedEqualTo(
      DateTime value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'dateMatched',
        value: value,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> dateMatchedGreaterThan(
    DateTime value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'dateMatched',
        value: value,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> dateMatchedLessThan(
    DateTime value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'dateMatched',
        value: value,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> dateMatchedBetween(
    DateTime lower,
    DateTime upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'dateMatched',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> idEqualTo(Id value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> idGreaterThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> idLessThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> idBetween(
    Id lower,
    Id upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'id',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> matchReasonEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'matchReason',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> matchReasonGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'matchReason',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> matchReasonLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'matchReason',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> matchReasonBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'matchReason',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> matchReasonStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'matchReason',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> matchReasonEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'matchReason',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> matchReasonContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'matchReason',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> matchReasonMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'matchReason',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> matchReasonIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'matchReason',
        value: '',
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> matchReasonIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'matchReason',
        value: '',
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> sponsorNameEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'sponsorName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> sponsorNameGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'sponsorName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> sponsorNameLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'sponsorName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> sponsorNameBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'sponsorName',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> sponsorNameStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'sponsorName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> sponsorNameEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'sponsorName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> sponsorNameContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'sponsorName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> sponsorNameMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'sponsorName',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> sponsorNameIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'sponsorName',
        value: '',
      ));
    });
  }

  QueryBuilder<Match, Match, QAfterFilterCondition> sponsorNameIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'sponsorName',
        value: '',
      ));
    });
  }
}

extension MatchQueryObject on QueryBuilder<Match, Match, QFilterCondition> {}

extension MatchQueryLinks on QueryBuilder<Match, Match, QFilterCondition> {}

extension MatchQuerySortBy on QueryBuilder<Match, Match, QSortBy> {
  QueryBuilder<Match, Match, QAfterSortBy> sortByAthleteName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'athleteName', Sort.asc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> sortByAthleteNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'athleteName', Sort.desc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> sortByDateMatched() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'dateMatched', Sort.asc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> sortByDateMatchedDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'dateMatched', Sort.desc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> sortByMatchReason() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'matchReason', Sort.asc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> sortByMatchReasonDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'matchReason', Sort.desc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> sortBySponsorName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'sponsorName', Sort.asc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> sortBySponsorNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'sponsorName', Sort.desc);
    });
  }
}

extension MatchQuerySortThenBy on QueryBuilder<Match, Match, QSortThenBy> {
  QueryBuilder<Match, Match, QAfterSortBy> thenByAthleteName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'athleteName', Sort.asc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> thenByAthleteNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'athleteName', Sort.desc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> thenByDateMatched() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'dateMatched', Sort.asc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> thenByDateMatchedDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'dateMatched', Sort.desc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> thenById() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.asc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> thenByIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.desc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> thenByMatchReason() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'matchReason', Sort.asc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> thenByMatchReasonDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'matchReason', Sort.desc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> thenBySponsorName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'sponsorName', Sort.asc);
    });
  }

  QueryBuilder<Match, Match, QAfterSortBy> thenBySponsorNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'sponsorName', Sort.desc);
    });
  }
}

extension MatchQueryWhereDistinct on QueryBuilder<Match, Match, QDistinct> {
  QueryBuilder<Match, Match, QDistinct> distinctByAthleteName(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'athleteName', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Match, Match, QDistinct> distinctByDateMatched() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'dateMatched');
    });
  }

  QueryBuilder<Match, Match, QDistinct> distinctByMatchReason(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'matchReason', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Match, Match, QDistinct> distinctBySponsorName(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'sponsorName', caseSensitive: caseSensitive);
    });
  }
}

extension MatchQueryProperty on QueryBuilder<Match, Match, QQueryProperty> {
  QueryBuilder<Match, int, QQueryOperations> idProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'id');
    });
  }

  QueryBuilder<Match, String, QQueryOperations> athleteNameProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'athleteName');
    });
  }

  QueryBuilder<Match, DateTime, QQueryOperations> dateMatchedProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'dateMatched');
    });
  }

  QueryBuilder<Match, String, QQueryOperations> matchReasonProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'matchReason');
    });
  }

  QueryBuilder<Match, String, QQueryOperations> sponsorNameProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'sponsorName');
    });
  }
}
